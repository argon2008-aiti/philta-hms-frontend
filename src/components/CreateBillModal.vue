<template>
          <Modal v-model="modal_active"
                :z-index=5000
                width=720
                :closable="false"
                :mask-closable="false"
                class-name="vertical-center-modal">
                <div class="modal-header" slot="header">
                    <span class="modal-title">{{billTitle}}</span>
                    <div class="total-slot">
                        <span class="bill-total-currency">GHC</span>
                        <span class="badge-span bill-total-badge">
                            {{billTotal}}
                        </span>
                    </div>
                </div>
                <Form ref="vitalsForm" label-position="top">
                    <Row :gutter=12>
                        <Col span="18">
                            <FormItem label="Patient:" prop="patient">
                                <Select v-model="billData.patient" 
                                    placeholder="Select Patient to bill to"
                                    size="large"
                                    :filterable="true"
                                    @on-change="patientSelected">
                                    <Option v-for="patient in patients" :key="patient._id" :value="patient._id">
                                    {{patient.full_name}} - {{patient.patient_id}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <Button 
                                type="dashed" 
                                size="large" long
                                :disabled="!patientIsAvailable"
                                style="margin-top: 25px"
                                @click="bill_item_modal_active=true">
                                <Icon type="ios-add"/>
                                Add Bill Item
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <div slot="footer">
                    <Button type="text" 
                            size="large" 
                            @click="modal_active=false">
                            <span>Discard</span>
                    </Button>

                    <Button type="primary" 
                            size="large" 
                            @click="saveBill()">
                            <span>Save</span>
                    </Button>
                </div>
                <Modal v-model="bill_item_modal_active"
                       :title="billModalTitle"
                       width=680
                       :z-index=5100>
                       <Form label-position="top">
                           <Row :gutter="12">
                               <Col span="4">
                                    <FormItem
                                        label="Quantity">
                                        <InputNumber 
                                            :min="1"
                                            v-model="currentBillItem.quantity"
                                            placeholder="Quantity">
                                        </InputNumber>
                                    </FormItem>
                                </Col>
                               <Col span="14">
                                    <FormItem label="Description">
                                        <Input
                                            v-model="currentBillItem.description"
                                            placeholder="service rendered or product purchased">
                                        </Input>
                                    </FormItem>
                                </Col>
                               <Col span="6">
                                    <FormItem
                                        label="Unit Cost">
                                        <InputNumber :step="0.01" 
                                            :min="0.01"
                                            placeholder="per unit price"
                                            style="width: 100%; text-align: right;"
                                            v-model="currentBillItem.per_unit_cost">
                                        </InputNumber>
                                    </FormItem>
                                </Col>
                            </Row>
                       </Form>
                        <div slot="footer">
                            <Button type="text" 
                                    @click="clearBillItemData">
                                    <span>Discard</span>
                            </Button>

                            <Button type="primary" 
                                    @click="addBillItemData">
                                    <span v-if="editing_bill">Save</span>
                                    <span v-else>Add</span>
                            </Button>
                        </div>
                </Modal>
                <Table 
                    size="small"
                    stripe
                    border
                    disabled-hover
                    v-if="billNotEmpty"
                    :columns="columns" 
                    :data="billData.bill_array">
                    <template slot="actions" slot-scope="{row, index}">
                        <Row :gutter="20">
                            <Col span="12">
                                <Icon type="ios-create-outline" 
                                      :size="18" 
                                      @click="editBill(index)"
                                      class="table-context-icon">
                                </Icon>
                            </Col>
                            <Col span="12">
                                <Icon type="ios-trash-outline" 
                                      :size="18" 
                                      @click="deleteBill(row)"
                                      class="table-context-icon">
                                </Icon>
                            </Col>
                        </Row>
                    </template>
                </Table>
          </Modal>
</template>

<script>
    import {randHex} from "../utils/randHex"
    export default {
        name: 'CreateBillModal',
        props: ['_id'],

        data() {
            return {
                modal_active: true,
                editing_bill: false,
                current_edit_index: 0,
                bill_item_modal_active: false,
                patients: '',
                billTitle: "Create New Bill",
                currentIndex: 0,
                selectedPatient: '',
                billData: {
                        patient: '',
                        bill_array: []
                    },

                currentBillItem: {
                    quantity: 1,
                    per_unit_cost: 0.01,
                    description: '',
                    covered_by_insurance: false
                },

                columns: [
                    {
                        title: 'Quantity',
                        key: 'quantity',
                        width: 100
                    },
                    {
                        title: 'Description',
                        key: 'description',
                        width: 300
                    },
                    {
                        title: 'Unit Cost',
                        key: 'per_unit_cost',
                        align: "right"
                    },
                    {
                        title: 'Sub Total',
                        key: 'sub_total',
                        align: "right"
                    },
                    {
                        title: '',
                        slot: 'actions',
                        width: 80
                    }
                ],
            }
        },

        methods: {
            saveBill() {
                if(this._id==-1) {   // this is a new bill
                    this.billData.authorized_by = this.$store.getters['user/currentUser'].id;
                    this.billData.bill_number = "#" + randHex(6);
                    this.$store.dispatch('bill/create', this.billData)
                        .then((response) => {
                            console.log(response);
                            if(response.patient) this.modal_active = false;
                        })
                        .catch((error) => {
                            console.log(error.response.status);
                            if(error.response.status == 500) {
                                this.$Message.error('Error saving vitals. Is the patient already queued?');
                            }
                        });
                }

                else {  // saving an edited bill
                    let id_ = this.billData._id;
                    this.billData.id = id_;
                    delete this.billData._id 
                    this.$store.dispatch('bill/update', this.billData)
                        .then((result) => {
                            console.log(result);
                            if(result.patient) this.modal_active = false;
                            
                        }).catch((err) => {
                            this.$Message.error(err);
                        });
                }

            },

            addBillItemData() {
                if(this.editing_bill) {
                    this.currentBillItem.sub_total = this.currentBillItem.quantity *
                                                    this.currentBillItem.per_unit_cost;
                    this.currentBillItem.sub_total = this.currentBillItem.sub_total.toFixed(2);
                    this.currentBillItem.per_unit_cost = parseFloat(this.currentBillItem.per_unit_cost).toFixed(2);
                    this.billData.bill_array.splice(this.current_edit_index, 1, {...this.currentBillItem})
                    this.editing_bill = false;
                    this.clearBillItemData();
                    return;
                }
                this.currentBillItem.index = this.currentIndex;
                this.currentBillItem.sub_total = this.currentBillItem.quantity *
                                                 this.currentBillItem.per_unit_cost;
                this.currentBillItem.sub_total = this.currentBillItem.sub_total.toFixed(2);
                this.currentBillItem.per_unit_cost = this.currentBillItem.per_unit_cost.toFixed(2);
                this.billData.bill_array.push({...this.currentBillItem});
                this.currentIndex = this.currentIndex + 1;
                this.clearBillItemData();
            },

            clearBillItemData() {
                this.currentBillItem.quantity = 1;
                this.currentBillItem.description = null;
                this.currentBillItem.per_unit_cost = 0.1;
                this.bill_item_modal_active = false;
            },

            deleteBill(row) {
                console.log(row);
                this.billData.bill_array.splice(row._index, 1);
            },

            editBill(index) {
                this.current_edit_index = index;
                this.currentBillItem = {...this.billData.bill_array[index]};
                this.editing_bill = true;
                this.bill_item_modal_active = true;
            },

            patientSelected(patient_id) {
                this.selectedPatient = patient_id;
            }

        },
        
        computed: {
            patientIsAvailable() {
                return this._id!=-1 || this.selectedPatient; 
            },

            billModalTitle() {
                return this.editing_bill ? "Edit Bill Item" : "Add Bill Item";
            },

            billTotal() {
                return this.billData.bill_array.reduce((total, bill) => {
                    total = total + parseFloat(bill.sub_total)
                    return total; 
                }, 0).toFixed(2);
            },

            billNotEmpty() {
                return this.billData.bill_array.length > 0;
            }

        },


        mounted() {
            this.modal_active = true;
            this.$store.dispatch('patient/fetch')
                .then((patients) => {
                    this.patients = patients
                }).catch((error) => {
                    console.log(error);
                });

            this.$store.dispatch('bill/fetch')
                .then((result) => {
                    console.log(result)
                    
                }).catch((err) => {
                    
                });

            if(this._id!=-1) {
                console.log(this._id);
                this.billTitle = "Edit Bill"
                let bill = this.$store.getters['bill/getBillByID'](this._id);
                this.billData = {...bill};  // we don't want to affect what is in store
                this.billData.patient = bill.patient.id;
            }

        }

    }
</script>

<style scoped>
    .avatar-container {
        background: white;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    .logo-hint {
        color: #bbb;
        text-align: center;
        cursor: pointer;
    }

    .table-context-icon:hover {
        color: black;
        transform: scale(1.1);
    }

    .bill-total-badge {
        font-size: 16px;
    }

    .bill-total-currency {
        color: #808695;
    } 

    .total-slot {
        float: right;
    }
    
    .modal-title {
        font-size: 16px;
        letter-spacing: 1px;
    }

</style>
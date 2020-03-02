<template>
    <Modal v-model="modal_active"
            :z-index=5000
            width=720
            title="Pay Bill"
            :closable="false"
            :mask-closable="false"
            class-name="vertical-center-modal">
            <Form ref="vitalsForm" label-position="top">
                <Row :gutter=12>
                    <Col span="16">
                        <div>
                            Patient:
                            <span class="bill-info">{{billData.patient.full_name}}</span>
                        </div>
                    </Col>
                    <Col span="8">
                        <div>
                            Billing Date:
                            <span class="bill-info">{{billData.createdAt | formatDate}}</span>
                        </div>
                    </Col>
                </Row>
                <Row :gutter=12>
                    <Col span="16">
                        <div style="margin: 10px 0px 20px 0px;">
                            Authorized By:
                            <span class="bill-info capitalize">{{billData.authorized_by.full_name}}</span>
                        </div>
                    </Col>
                    <Col span="8">
                        <div style="margin: 10px 0px 20px 0px;">
                            Bill Code:
                            <span class="bill-info">{{billData.bill_number}}</span>
                        </div>
                    </Col>
                </Row>
            </Form>

            <div slot="footer">
                <Button type="text" 
                        size="large" 
                        @click="modal_active=false">
                        <span>Cancel</span>
                </Button>

                <Button type="primary" 
                        size="large" 
                        @click="payBill()">
                        <span>Pay</span>
                </Button>
            </div>
            <Table 
                size="small"
                stripe
                border
                disabled-hover
                :columns="columns" 
                :data="billData.bill_array">
                <template slot="actions" slot-scope="{row, index}">
                    <Checkbox @on-change="insuranceChanged($event, row, index)">
                    </Checkbox>
                </template>
            </Table>

            <div style="margin-top: 10px;">
                <Row>
                    <Col span="10" offset="10" style="text-align: right;">
                        Total Invoice Amount:
                    </Col>
                    <Col span="4" style="text-align: right; font-weight: bold;">
                        {{billTotal}}
                    </Col>
                </Row>
                <Row style="margin-top: 5px;">
                    <Col span="10" offset="10" style="text-align: right;">
                         Insurance Cover:
                    </Col>
                    <Col span="4" style="text-align: right; font-weight: bold;">
                         {{insuranceTotal}}
                    </Col>
                </Row>
                <Row style="margin-top: 5px;">
                    <Col span="10" offset="10" style="text-align: right;">
                         Amount to Pay:
                    </Col>
                    <Col span="4" style="text-align: right; font-weight: bold;">
                         {{amountToPay}}
                    </Col>
                </Row>
            </div>
            <Divider></Divider>
            <div>
                <Row :gutter="12" style="margin-bottom: 10px;">
                    <Col span="18">
                        <RadioGroup v-model="billData.payment_status.payment_method">
                            <Radio label="Cash" border></Radio>
                            <Radio label="Cheque" border></Radio>
                            <Radio label="MoMo" border></Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="6">
                        <Input
                            v-model="billData.payment_status.amount_paid"
                            element-id="amount_to_pay"
                            placeholder="Amount Paid">
                        </Input>
                    </Col>
                </Row>
                <Row v-if="billData.payment_status.payment_method=='Cheque'" :gutter="12">
                    <Col span="9">
                        <Input
                            v-model="issuing_bank"
                            placeholder="Issuing Bank">
                        </Input>
                    </Col>
                    <Col span="6">
                        <Input
                            v-model="account_number"
                            placeholder="Account Number">
                        </Input>
                    </Col>
                    <Col span="4">
                        <Input
                            v-model="cheque_number"
                            placeholder="Cheque Number">
                        </Input>
                    </Col>
                    <Col span="5">
                        <DatePicker
                            v-model="date_on_cheque"
                            placeholder="Date on Cheque ">
                        </DatePicker>
                    </Col>
                </Row>
                <Row v-if="billData.payment_status.payment_method=='MoMo'" :gutter="12">
                    <Col span="10">
                        <Input
                            v-model="account_name"
                            placeholder="MoMo Account Name">
                        </Input>
                    </Col>
                    <Col span="6">
                        <Input
                            v-model="momo_number"
                            placeholder="MoMo Number">
                        </Input>
                    </Col>
                    <Col span="8">
                        <Input
                            v-model="txn_id"
                            placeholder="Transaction ID">
                        </Input>
                    </Col>
                </Row>
            </div>
        </Modal>
</template>

<script>
import moment from 'moment';
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
                currentIndex: 0,
                selectedPatient: '',
                // cheque payment =======
                issuing_bank: '',
                cheque_number: '',
                account_number: '',
                date_on_cheque: '',

                // MoMo payment =========
                account_name: '',
                momo_number: '',
                txn_id: '',

                billData: {
                        patient: '',
                        authorized_by: '',
                        bill_array: [],
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
                    // {
                    //     title: 'I.C',
                    //     slot: 'actions',
                    //     width: 80
                    // }
                ],
            }
        },

        methods: {
            payBill() {
                let id_ = this.billData._id;
                this.billData.id = id_;
                delete this.billData._id 
                switch (this.billData.payment_status.payment_method) {
                    case "Cash":
                        break;
                               
                    case "Cheque":
                        this.billData.payment_status.momo_payment = null;   // reset momo payment just in case
                        this.billData.payment_status.cheque_payment = {};
                        this.billData.payment_status.cheque_payment.issuing_bank = this.issuing_bank;
                        this.billData.payment_status.cheque_payment.cheque_number = this.cheque_number;
                        this.billData.payment_status.cheque_payment.account_number = this.account_number;
                        this.billData.payment_status.cheque_payment.date_on_cheque = this.date_on_cheque;
                        break;

                    case "MoMo":
                        this.billData.payment_status.cheque_payment = null; //reset cheque payment just in case
                        this.billData.payment_status.momo_payment = {};
                        this.billData.payment_status.momo_payment.account_name = this.account_name;
                        this.billData.payment_status.momo_payment.momo_number = this.momo_number;
                        this.billData.payment_status.momo_payment.txn_id = this.txn_id;
                        break;
                
                    default:
                        return;
                }

                this.billData.payment_status.paid = true;
                this.billData.payment_status.payment_at = new Date();
                this.billData.payment_status.received_by = this.$store.getters['user/currentUser'].id;
                console.log(this.billData);
                this.$store.dispatch('bill/update', this.billData)
                    .then((result) => {
                        console.log(result);
                        if(result.patient) this.modal_active = false;
                        
                    }).catch((err) => {
                        this.$Message.error(err);
                    });

            },

            expired: function(date) {
                let today = moment();
                let expire_date = moment(date);
                return expire_date.diff(today, 'days') < 0;
            },

            insuranceChanged(event, row, index) {
                row.covered_by_insurance = event;
                this.billData.bill_array.splice(index, 1, row);
            }

        },
        
        computed: {

            billTotal() {
                return this.billData.bill_array.reduce((total, bill) => {
                    total = total + parseFloat(bill.sub_total)
                    return total; 
                }, 0).toFixed(2);
            },

            insuranceTotal() {
                return this.billData.bill_array.filter(({covered_by_insurance})=>
                    covered_by_insurance===true)
                    .reduce((total, bill) => {
                        total = total + parseFloat(bill.sub_total)
                        return total; 
                    }, 0).toFixed(2);
            },

            amountToPay() {
                let amount = this.billTotal - this.insuranceTotal;
                return amount.toFixed(2);
            }

        },


        mounted() {
            this.modal_active = true;
            this.$store.dispatch('bill/fetch')
                .then((result) => {
                    console.log(result)
                    
                }).catch((err) => {
                    
                });

            if(this._id!=-1) {
                let bill = this.$store.getters['bill/getBillByID'](this._id);
                this.billData = {...bill};  // we don't want to affect what is in store
                if(this.billData.patient.insurance_policy.provider &&
                   !this.expired(this.billData.patient.insurance_policy.policy_end)) {
                    let actions = {
                                    title: 'Insure',
                                    slot: 'actions',
                                    width: 80
                                  }
                    this.columns.push(actions);
                }
            }

        }

    }
</script>

<style scoped>
    .bill-info {
        font-weight: bold;
        margin-left: 10px;
    }


</style>

<style>
    #amount_to_pay {
        text-align: right;
    }

</style>
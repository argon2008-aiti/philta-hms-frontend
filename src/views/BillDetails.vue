<template>
<div class="page-container" ref="container">
    <div class="main-contents">
        <div class="page-header">
            <Row>
                <Col span="20">
                    <span class="header-title">Bill Details</span>
                </Col>
                <Col span="4" style="text-align: right; padding-top: 5px;">
                    <!-- <span style="margin-right: 20px;" class="page-action-item">
                        <Icon type="ios-open-outline" size="24"></Icon>
                        Export
                    </span> -->
                    <span class="page-action-item">
                        <Icon type="ios-print-outline" size="24"></Icon>
                        Print
                    </span>
                </Col>
            </Row>
        </div>
        <div style="margin-top: 60px; min-height: 80vh;">
            <Card dis-hover class="section-card">
                <div class="page-contents">
                <Row :gutter=12>
                    <Col span="16">
                        <div>
                            Patient:
                            <span class="bill-info">{{bill.patient.full_name}}</span>
                        </div>
                    </Col>
                    <Col span="8">
                        <div>
                            Billing Date:
                            <span class="bill-info">{{bill.createdAt | formatDate}}</span>
                        </div>
                    </Col>
                </Row>
                <Row :gutter=12>
                    <Col span="16">
                        <div style="margin: 10px 0px 20px 0px;">
                            Authorized By:
                            <span class="bill-info capitalize">{{bill.authorized_by.full_name}}</span>
                        </div>
                    </Col>
                    <Col span="8">
                        <div style="margin: 10px 0px 20px 0px;">
                            Bill Code:
                            <span class="bill-info">{{bill.bill_number}}</span>
                        </div>
                    </Col>
                </Row>
                    <Table 
                        size="small"
                        border
                        disabled-hover
                        :columns="columns" 
                        :data="bill.bill_array">
                        <template slot="actions" slot-scope="{row, index}">
                            <p v-if="row.covered_by_insurance">Yes</p>
                            <p v-else>No</p>
                        </template>
                    </Table>
                    <Row style="margin-top: 10px;">
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
                    <Divider></Divider>
                    <div v-if="bill.payment_status.payment_method==='Cash'">
                        <Row style="margin-top: 0px;" >
                            <Col span="10">
                                Payment Method:
                                <span style="font-weight: bold">{{bill.payment_status.payment_method}}</span>
                            </Col>
                            <Col span="10" style="text-align: right;">
                                Amount Paid:
                            </Col>
                            <Col span="4" style="text-align: right; font-weight: bold;">
                                {{bill.payment_status.amount_paid.toFixed(2)}}
                            </Col>
                        </Row>
                        <Row style="margin-top: 15px;">
                            <Col span="14" offset="10" style="text-align: right;">
                                Paid To:
                                <span style="font-weight: bold; text-transform: capitalize;">{{bill.payment_status.received_by.full_name}}</span>
                            </Col>
                        </Row>
                        <Row style="margin-top: 5px;">
                            <Col span="14" offset="10" style="text-align: right;">
                                Payment Date:
                                <span style="font-weight: bold;">{{bill.payment_status.payment_at | formatDate}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div v-else-if="bill.payment_status.payment_method==='Cheque'">
                        <Row style="margin-top: 0px;">
                            <Col span="10">
                                Payment Method:
                                <span style="font-weight: bold">{{bill.payment_status.payment_method}}</span>
                            </Col>
                            <Col span="10" style="text-align: right;">
                                Amount Paid:
                            </Col>
                            <Col span="4" style="text-align: right; font-weight: bold;">
                                {{bill.payment_status.amount_paid.toFixed(2)}}
                            </Col>
                        </Row>
                        <Row style="margin-top: 5px;">
                            <Col span="10">
                                Issuing Bank:
                                <span style="font-weight: bold">{{bill.payment_status.cheque_payment.issuing_bank}}</span>
                            </Col>
                        </Row>
                        <Row style="margin-top: 5px;">
                            <Col span="10">
                                Account Number:
                                <span style="font-weight: bold">{{bill.payment_status.cheque_payment.account_number}}</span>
                            </Col>
                            <Col span="14" style="text-align: right;">
                                Paid To:
                                <span style="font-weight: bold; text-transform: capitalize;">{{bill.payment_status.received_by.full_name}}</span>
                            </Col>
                        </Row>
                        <Row style="margin-top: 5px;">
                            <Col span="10">
                                Cheque Number:
                                <span style="font-weight: bold">{{bill.payment_status.cheque_payment.cheque_number}}</span>
                            </Col>
                            <Col span="14" style="text-align: right;">
                                Payment Date:
                                <span style="font-weight: bold;">{{bill.payment_status.payment_at | formatDate}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div v-if="bill.payment_status.payment_method=='MoMo'">
                        <Row style="margin-top: 0px;">
                            <Col span="10">
                                Payment Method:
                                <span style="font-weight: bold">{{bill.payment_status.payment_method}}</span>
                            </Col>
                            <Col span="10" style="text-align: right;">
                                Amount Paid:
                            </Col>
                            <Col span="4" style="text-align: right; font-weight: bold;">
                                {{bill.payment_status.amount_paid.toFixed(2)}}
                            </Col>
                        </Row>
                        <Row style="margin-top: 5px;">
                            <Col span="10">
                                Account Name:
                                <span style="font-weight: bold">{{bill.payment_status.momo_payment.account_name}}</span>
                            </Col>
                        </Row>
                        <Row style="margin-top: 5px;">
                            <Col span="10">
                                MoMo Number:
                                <span style="font-weight: bold">{{bill.payment_status.momo_payment.momo_number}}</span>
                            </Col>
                            <Col span="14" style="text-align: right;">
                                Paid To:
                                <span style="font-weight: bold; text-transform: capitalize;">{{bill.payment_status.received_by.full_name}}</span>
                            </Col>
                        </Row>
                        <Row style="margin-top: 5px;">
                            <Col span="10">
                                Transaction ID:
                                <span style="font-weight: bold">{{bill.payment_status.momo_payment.txn_id}}</span>
                            </Col>
                            <Col span="14" style="text-align: right;">
                                Payment Date:
                                <span style="font-weight: bold;">{{bill.payment_status.payment_at | formatDate}}</span>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Card>
        </div>

    </div>
</div>
</template>

<script>
import moment from 'moment';
    export default {
        props: ["bill"],
        name: 'BillDetails',

        components: {
        },

        data() {
            return {
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
            checkInsured() {
                let isInsured = false;
                for (var i = 0; i < this.bill.bill_array.length; i++) {
                    if (this.bill.bill_array[i].covered_by_insurance) {
                        isInsured = true;
                        break;
                    }
                }
                return isInsured;
            }
        },

        computed: {

            billTotal() {
                return this.bill.bill_array.reduce((total, bill) => {
                    total = total + parseFloat(bill.sub_total)
                    return total; 
                }, 0).toFixed(2);
            },

            insuranceTotal() {
                return this.bill.bill_array.filter(({covered_by_insurance})=>
                    covered_by_insurance===true)
                    .reduce((total, bill) => {
                        total = total + parseFloat(bill.sub_total)
                        return total; 
                    }, 0).toFixed(2);
            },
            
        },

        created() {
        },

        mounted() {
            console.log(this.bill);
            if(this.checkInsured) {
                let actions = {
                                title: 'Insured',
                                slot: 'actions',
                                width: 100
                              }
                this.columns.push(actions);
            }

            try {
               let receiver = this.bill.payment_status.received_by.full_name; 
            } catch (error) {
               this.bill.payment_status.received_by = {} ;
               this.bill.payment_status.received_by.full_name = "-"
            }
        } 
        
    }
</script>

<style lang="css" scoped>
    .main-contents {
      background: #fcfcfc;
    }

    .page-header .header-title {
      font-size: 24px;
      letter-spacing: 2px;
      display: inline-block;
    }

    .page-header {
        background: #fff;
        position: fixed;
        margin-left: 240px;
        padding: 20px 20px;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        height: auto;
        -webkit-box-shadow: 0px 4px 4px -4px #dcdedc;
            -mox-box-shadow: 0px 4px 4px -4px #dcdedc;
        box-shadow: 0px 4px 4px -3px #dcdedc;
    }

    .page-contents {
      background: white;
      margin-top: 1px;
      padding: 10px;
      width: 60%;
      margin: auto;
      clear: both;
    }

    .bill-info {
        font-weight: bold;
        margin-left: 10px;
    }

    .page-action-item {
        color: #808695;
    }



</style>

<style>
    .page-action-item:hover {
        cursor: pointer;
        color: #236b3a;
    }
</style>
<template>
  <div class="page-container" ref="container">
    <div class="page-header">
        <span class="header-title">Bills and Payments</span>

        <span>
            <Button type="primary" 
                    size="large"
                    style="float: right"
                    @click="openBillModal(-1)">
                    Create Bill
            </Button>
        </span>
    </div>
    <Card dis-hover class="table-card" style="margin-top: 50px; min-height: 80vh;">
        <div class="page-contents" v-if="rawData.length > 0">
          <Table
              :columns="columns"
              :data="billData"
              stripe
              size="large">
              <template slot="insurance" slot-scope="{row, index}">
                <Badge :status="getInsuranceStatus(row)" :text="row.insurance"/>
              </template>
              <template slot="total" slot-scope="{row, index}">
                <div>{{ row.total }}</div>
                <div style="font-size: 12px; color: #228c22; font-weight: bold;">
                     {{ row.amount_paid }}
                </div>
              </template>
              <template slot="actions" slot-scope="{row, index}">
                <Row :gutter="18">
                  <Col span="12">
                    <Button 
                        type="success"
                        v-if="row.payment_status.paid"
                        @click="openBillDetails(index)">
                      View
                    </Button>
                    <Button 
                        type="success"
                        v-else
                        @click="openBillModal(row.id)">
                      Edit
                    </Button>
                  </Col>
                  <Col span="12">
                    <Button type="warning"
                            ghost
                            v-if="row.payment_status.paid">
                      Paid
                    </Button>
                    <Button type="error"
                            v-else
                            @click="openPayBillModal(row.id)">
                      Pay
                    </Button>
                  </Col>
                </Row>
              </template>
          </Table>
        </div>
        <div v-else 
              style="text-align: center; 
                    vertical-align: middle;
                    margin-top: 100px">
              <NoDataView message="No bills record to show">
              </NoDataView>
        </div>
    </Card>
  </div>
</template>

<script>
import Vue from 'vue';
import store from '../store/index'
import CreateBillModal from '@/components/CreateBillModal.vue'
import PayBillModal from '@/components/PayBillModal.vue'
import NoDataView from '@/components/NoDataView.vue'
import moment from 'moment';

export default {
  components: {
    NoDataView,
  },

  data() {
    return {
      columns: [
        {
          title: "Bill Code",
          key: 'bill_number',
          width: 100,
          className: "bill-code-column"
        },
        {
          title: "Bill Date",
          key: 'bill_date',
          align: 'center',
          width: 150,
        },
        {
          title: "Patient",
          key: 'patient',
        },
        {
          title: "Insurance",
          slot: "insurance",
          width: 150,
        },
        {
          title: "Authorized By",
          key: 'authorized_by',
          className: "authorized-staff-column"
        },
        {
          title: "Paid To",
          key: 'received_by',
          className: "authorized-staff-column"
        },
        {
          title: "Total",
          slot: 'total',
          width: 100,
          align: 'right',
          className: "total-column"
        },
        {
          title: "",
          slot: 'actions',
          width: 150
        },
      ]
    }
  },

  computed: {
    billData() {
       let real_data = [];
       this.rawData.map((data)=> {
          let bill_object = {};
          bill_object.id         = data._id;
          bill_object.bill_number = data.bill_number;
          bill_object.bill_date   = moment(data.createdAt).format('DD-MM-YYYY');
          bill_object.patient     = data.patient.full_name;
          bill_object.payment_status = data.payment_status;
          try {
               bill_object.received_by = data.payment_status.received_by.full_name
          } catch (error) {
               bill_object.received_by = "-"
          }
          bill_object.authorized_by = data.authorized_by.full_name
          bill_object.total = data.bill_array.reduce((total, bill)=>{
                                 total = total + bill.sub_total
                                 return total;
                              }, 0).toFixed(2);
          bill_object.insurance = !data.patient.insurance_policy.provider ? "none" : 
                                  this.expired(data.patient.insurance_policy.policy_end) ? "expired" : "active";
          
          bill_object.amount_paid = (data.payment_status.amount_paid|0).toFixed(2);
          real_data.push(bill_object);
       })
       return real_data;
    },

    rawData() {
      return this.$store.getters['bill/all'];
    }
  },

  methods: {
    openBillModal(bill_id) {
        let ComponentClass = Vue.extend(CreateBillModal);
        this.billsModal = new ComponentClass({store, 
                propsData: {_id: bill_id}
                });
        this.billsModal.$root = this.$root;
        this.billsModal.$mount() // pass nothing
        this.$refs.container.appendChild(this.billsModal.$el)

    },

    openPayBillModal(bill_id) {
        let ComponentClass = Vue.extend(PayBillModal);
        this.billsModal = new ComponentClass({store, 
                propsData: {_id: bill_id}
                });
        this.billsModal.$root = this.$root;
        this.billsModal.$mount() // pass nothing
        this.$refs.container.appendChild(this.billsModal.$el)

    },

    expired: function(date) {
        let today = moment();
        let expire_date = moment(date);
        return expire_date.diff(today, 'days') < 0;
    },

    getInsuranceStatus(row) {
        let status = row.insurance;
        let returnStatus = "default";

        switch (status) {
          case "active":
            returnStatus = "success"
            break;
        
          case "expired":
            returnStatus = "error"
            break;

          default:
            break;
        }

        return returnStatus;
    },

    openBillDetails(index) {
        this.$router.push({name: 'billings_details', params: {'bill': this.rawData[index]}});
    }
  },

  created () {
    this.$store.dispatch('bill/fetch');
  },


}
</script>

<style scoped>
    .page-contents {
      padding: 0px;
    }
</style>

<style>

    .ivu-table td.authorized-staff-column {
        text-transform: capitalize;
    }

    .ivu-table td.bill-code-column {
        letter-spacing: 1px;
    }

    .ivu-table td.total-column {
        /* font-weight: bold; */
        letter-spacing: 1px;
        border-left: 1px solid #e8eaec;
        border-right: 1px solid #e8eaec;
    }

</style>

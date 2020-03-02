<template>
  <div class="page-container" ref="container">
    <div class="page-header">
        <span class="header-title">Health Insurance</span>
        <Button type="primary" @click="addInsuranceProvider" style="float: right;" size="large">
          Add Provider
        </Button>
    </div>
    <div style="margin-top: 60px" v-if="providerCount==0">
        <Card dis-hover class="section-card" style="min-height: 80vh">
            <div class="page-contents">
              <div class="insurance-providers-container-no-data">
                  <img src="../assets/no_insurance.png" alt="no insurance" srcset="" width="100px" height="100px">
                  <p class="no-provider-text">There are no insurance providers to show!</p>
                  <Button type="primary" @click="addInsuranceProvider">
                    Add Insurance Provider
                  </Button>
              </div>
            </div>
        </Card>
    </div>
  <div v-else>
    <div style="margin-top: 60px">
    <p class="section-header-text">PROVIDERS</p>
        <Card dis-hover class="section-card table-card">
            <div class="page-contents">
                 <Table
                      :data="providerList"
                      stripe
                      :columns="columns">

                 </Table>
            </div>
        </Card>
    </div>
    <div style="margin-top: 30px">
    <p class="section-header-text">CLAIMS</p>
        <Card dis-hover class="section-card table-card">
            <div class="page-contents">
                 <Table
                      :data="claimList"
                      stripe
                      v-if="claimList.length!=0"
                      :columns="claims_columns">
                      <template slot-scope="{row, index}" slot="status">
                        <div class="insurance_status" :class="{ is_pending: row.status=='PENDING' }">
                          {{row.status}}
                        </div>
                      </template>
                 </Table>
                 <div v-else style="padding: 50px; text-align: center;">
                   <NoDataView message="No claims found!">
                   </NoDataView>
                 </div>
            </div>
        </Card>
    </div>
    </div>
  </div>
</template>

<script>
import NewInsuranceProviderModal from '@/components/AddInsuranceProvider.vue'
import NoDataView from '@/components/NoDataView';
import Vue from 'vue'
import store from '../store/index'
import moment from 'moment'
export default {
  components: {
    NoDataView
  },

  data() {
    return {
       isColored: false,
       columns: [
         {
           title: 'Company',
           key: 'company_name'
         },
         {
           title: 'Phone',
           key: 'phone_number',
           align: 'center'
         },
         {
           title: 'Email',
           key: 'email'
         },
         {
           title: 'Insurer Type',
           key: 'insurer_type'
         },
       ],

       claims_columns: [
         {
           type: 'index',
           width: 60,
           align: 'center'
         },
         {
           title: 'Date',
           key: 'bill_date',
           align: 'center',
           width: 150
         },
         {
           title: 'Bill Number',
           key: 'bill_number',
           align: 'center',
           width: 200
         },
         {
           title: 'Patient',
           key: 'patient',
         },
         {
           title: 'Insurer',
           key: 'insurer'
         },
         {
           title: 'Amount',
           key: 'total',
           align: 'right',
           width: 100,
          className: "total-column"
         },

         {
           title: 'Status',
           slot: 'status',
           width: 150,
           align: 'center',
         },
       ]
    }
  },
  
  computed: {
    providerList: function() {
      return this.$store.getters['provider/all'];
    },

    providerCount: function() {
      return this.$store.getters['provider/providerCount'];
    },

    claimList: function() {
       let real_data = [];
       this.rawData.map((data)=> {
          let claim_object = {};
          claim_object.bill_date   = moment(data.created_at).format('DD-MM-YYYY');
          claim_object.patient     = data.patient.full_name;
          claim_object.status = data.paid ? "PAID" : "PENDING";
          claim_object.total = data.bill_array.reduce((total, bill)=>{
                         total = total + bill.sub_total
                         return total;
                      }, 0).toFixed(2);
          claim_object.insurer = data.provider.company_name;
          claim_object.bill_number = data.bill.bill_number;
          real_data.push(claim_object);
       })
       return real_data;
    },

    rawData: function() {
      return this.$store.getters['provider/allClaims'];
    }

  },

  methods: {
    fetchProviders() {
       return this.$store.dispatch('provider/fetch');
    },
    
    fetchClaims() {
       return this.$store.dispatch('provider/fetchClaims');
    },

    addInsuranceProvider() {
        let ComponentClass = Vue.extend(NewInsuranceProviderModal);
        let instance = new ComponentClass({store,
            propsData: { title: 'New Insurance Provider' }
        })
        instance.$mount() // pass nothing
        this.$refs.container.appendChild(instance.$el)
    },

    createImageUrl(url) {
        return "http://localhost:3000/upload/" + url;
    }
  },

  mounted() {
    this.fetchProviders()
       .then((result) => {
          console.log(result);
       }).catch((error) => {
          console.log(error);
          if (error.response) {
              switch (error.response.status) {
                  // not logged in or token expired
                  case 401:
                      localStorage.removeItem('token');
                      this.$router.push({ name: 'login', params: { show_alert: true } });
                      break;

                  default:
                      break;
              }
          } 
          
          if(error.message==="Network Error") {
              console.log("Unable to reach server");
              this.$Message.error({
                top: 50,
                duration: 5,
                render: h => {
                  return h('div', [
                        h('p', "Unable to reach server!")
                    ]);
                }
              })
          }
       });

    this.fetchClaims();
    this.$root.$on("newProviderSaveSuccess", (data) => {
      this.$Message.success({
        top: 50,
        duration: 5,
        render: h => {
          return h('div', [
                h('p', data.company_name + " has been saved successfully")
            ]);
        }
      })

    });
  }

}
</script>

<style scoped>
    .insurance-providers-container-no-data {
        text-align: center;
        padding: 20px;
        margin-top: 15vh;
    }

    .insurance-providers-container {
      display: block;
    }

    .no-provider-text {
        margin-bottom: 30px;
        color: #a8a8a8;
        font-size: 16px;
    }

    .flex-container {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      justify-content: space-between;
    }

    .provider-enclosure {
      /*width: 100px;
      height: 100px;*/
      margin-bottom: 50px;
    }

    .provider-name {
      text-align: center;
    }
    
    .insurance-logo {
      height: auto;
      filter: grayscale(1);
      cursor: pointer;
    }

    .insurance-logo:hover {
      filter: none;
    }

    .page-contents {
      padding: 0px;
    }
    
    .insurance_status {
      border: 1px #ccc solid;
      color: inherit;
    }
  
</style>

<style>
    .ivu-table th {
      background-color: white;
    }

</style>
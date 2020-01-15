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
        <Card dis-hover class="section-card">
            <div class="page-contents">
                  <div class="flex-container">
                    <div v-for="provider in providerList" class="provider-enclosure" :key="provider.id">
                      <img :src="createImageUrl(provider.logo_url)" alt="" srcset=""
                            width="200px" class="insurance-logo">
                    </div>
                  </div>
            </div>
        </Card>
    </div>
    <div style="margin-top: 30px">
    <p class="section-header-text">CLAIMS</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
            </div>
        </Card>
    </div>
    </div>
  </div>
</template>

<script>
import NewInsuranceProviderModal from '@/components/AddInsuranceProvider.vue'
import Vue from 'vue'
import store from '../store/index'
export default {

  data() {
    return {
       isColored: false,
    }
  },
  
  computed: {
    providerList: function() {
      return this.$store.getters['provider/all'];
    },
    providerCount: function() {
      return this.$store.getters['provider/providerCount'];
    }
  },

  methods: {
    fetchProviders() {
       return this.$store.dispatch('provider/fetch');
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
</style>

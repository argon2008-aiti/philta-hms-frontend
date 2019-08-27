<template>
  <div class="page-container" ref="container">
    <div class="page-header">
        <span class="header-title">Health Insurance</span>
    </div>

    <div style="margin-top: 60px">
    <p class="section-header-text">PROVIDERS</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
              <div v-if="providerCount==0" class="insurance-providers-container-no-data">
                  <img src="../assets/no_insurance.png" alt="no insurance" srcset="" width="100px" height="100px">
                  <p class="no-provider-text">There are no providers in the database!</p>
                  <Button type="primary" @click="addInsuranceProvider">
                    Add Insurance Provider
                  </Button>
              </div>
              <div v-else class="insurance-providers-container">
                  <Button type="primary" @click="addInsuranceProvider" style="margin-bottom: 20px;">
                    Add Provider
                  </Button>
                  <div class="flex-container">
                    <div v-for="provider in providerList" class="provider-enclosure" :key="provider.id">
                        <Icon type="ios-podium-outline" size="96" color="#ddd"/>
                        <p class="provider-name">{{provider.company_name}}</p>
                    </div>
                  </div>
              </div>
            </div>
        </Card>
    </div>
    <div style="margin-top: 30px">
    <p class="section-header-text">CLAIMS</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
                 <h2>Health Insurance contents</h2>
            </div>
        </Card>
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
       this.$store.dispatch('provider/fetch', {
                               router: this.$router
                             });
    },

    addInsuranceProvider() {
        let ComponentClass = Vue.extend(NewInsuranceProviderModal);
        let instance = new ComponentClass({store,
            propsData: { title: 'New Insurance Provider' }
        })
        instance.$mount() // pass nothing
        this.$refs.container.appendChild(instance.$el)
    }
  },

  mounted() {
    this.fetchProviders();
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
    }

    .insurance-providers-container {
      display: block;
    }

    .no-provider-text {
        margin-bottom: 20px;
        color: #a8a8a8;
        font-size: 14px;
    }

    .flex-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }

    .provider-enclosure {
      /*width: 100px;
      height: 100px;*/
    }

    .provider-name {
      text-align: center;
    }
</style>

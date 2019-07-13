import Vue from 'vue'
import Vuex from 'vuex'

import patientStoreModule from "./patientStoreModule";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
      patient: patientStoreModule,
  }
})

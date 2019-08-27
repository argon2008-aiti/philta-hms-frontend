import Vue from 'vue'
import Vuex from 'vuex'

import patientStoreModule from "./patientStoreModule";
import insuranceProviderStoreModule from "./insuranceProviderStoreModule";
import userStoreModule from "./userStoreModule";

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        patient: patientStoreModule,
        provider: insuranceProviderStoreModule,
        user: userStoreModule,
    }
})
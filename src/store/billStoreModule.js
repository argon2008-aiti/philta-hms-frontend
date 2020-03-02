import { $axios } from "../utils/http";
import Vue from "vue";

export default {
    namespaced: true,
    // -----------------------------------------------------------------
    state: {
        api_endpoint: 'bill',
        bills: [],
    },
    // -----------------------------------------------------------------
    getters: {
        // getters and computed props on the todos data
        patientCount: state => {
            return state.patients.length;
        },

        all: state => {
            return state.bills;
        },

        getPatientByIndex: (state) => (index) => {
            return state.patients[index];
        },

        getPatientIndex: (state) => (id) => {
            return state.patients.findIndex(pat => pat.id === id);
        },

        getBillByID: (state) => (id) => {
            //
            let bill = state.bills.find(pat => pat._id === id);
            //console.log("This is the patient " + patient);
            return bill;
        },

        asyncSavingPatient: state => {
            return state.asyncSavingPatient;
        },

    },
    // -----------------------------------------------------------------
    mutations: {
        // stuff to set todos data locally
        setBillList: (state, bills) => {
            Vue.set(state, 'bills', bills);
        },

        addBillToList: (state, bill) => {
            state.bills.unshift(bill);
        },

        updateBillData: (state, newData) => {
            let index = state.bills.findIndex(pat => pat._id === newData._id);
            Vue.set(state.bills, index, newData);
        },
        //console.log(index);

        // deletePatientByIndex: (state, index) => {
        //     state.patients.splice(index, 1);
        // },

        // deletePatientByID: (state, id) => {
        //     let index = state.patients.findIndex(pat => pat.id === id);
        //     state.patients.splice(index, 1);
        // },

        // setAsyncSavingPatient: (state, saving) => {
        //     state.asyncSavingPatient = saving;
        // }
    },
    // -----------------------------------------------------------------
    actions: {

        fetch: (context) => new Promise(async function(resolve, reject) {
            // don't fetch if we already have patients. 
            // if (context.getters.patientCount != 0) {
            //     console.log("fetched from store");
            //     resolve(context.getters.all('id'));
            //     return;
            // }
            // stuf to retrieve all the logged in user's todos from backend
            try {
                let { data } = await $axios.get(context.state.api_endpoint);
                context.commit('setBillList', data);
                console.log(data);
                resolve(data);

            } catch (error) {
                reject(error);
            }
        }),

        create: (context, payload) => new Promise(async function(resolve, reject) {
            try {
                let { data } = await $axios.post(context.state.api_endpoint, payload);
                context.commit('addBillToList', data);
                console.log(data);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        }),

        // read: (context, id) => new Promise(async function(resolve, reject) {
        //     // stuff to retrieve a particular todo data from the backend : CRUD READ ACTION
        //     try {
        //         let { data } = await $axios.get(context.state.api_endpoint, { params: { id: id } });
        //         resolve(data);
        //     } catch (error) {
        //         reject(error);
        //     }
        // }),

        update: (context, payload) => new Promise(async function(resolve, reject) {
            console.log(payload);
            try {
                let { data } = await $axios.put(context.state.api_endpoint, payload);
                context.commit('updateBillData', data);
                resolve(data);
                console.log(data);
            } catch (error) {
                reject(error);
            }
        }),

        // delete: (context, index) => new Promise(async function(resolve, reject) {
        //     let patient = context.getters.getPatientByIndex(index);
        //     try {
        //         let { data } = await $axios.delete(context.state.api_endpoint, { params: { id: patient.id } });
        //         resolve(data)
        //         context.commit('deletePatientByIndex', index);
        //     } catch (error) {
        //         reject(error);
        //     }
        // }),
    }
}
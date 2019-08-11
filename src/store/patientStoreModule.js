/* eslint-disable no-console */
/** VUEX module for patients management in hospital management app **/
import $axios from "../utils/http";
import sortByKey from "../utils/sorter";
import Vue from "vue";
import randomcolor from 'randomcolor';

export default {
    namespaced: true,
    // -----------------------------------------------------------------
    state: {
        api_endpoint: 'patient',
        patients: [],
        asyncSavingPatient: false,
    },
    // -----------------------------------------------------------------
    getters: {
        // getters and computed props on the todos data
        patientCount: state => {
            return state.patients.length;
        },

        all: state => sort_key => {
            let sorted = sortByKey.sortByKey(state.patients, sort_key);
            return sorted;
        },

        getPatientByIndex: (state) => (index) => {
            return state.patients[index];
        },

        getPatientByID: (state) => (id) => {
            //console.log(id);
            let patient = state.patients.find(pat => pat.id === id);
            //console.log("This is the patient " + patient);
            return patient
        },

        asyncSavingPatient: state => {
            return state.asyncSavingPatient;
        },

    },
    // -----------------------------------------------------------------
    mutations: {
        // stuff to set todos data locally
        setPatientList: (state, patients) => {
            Vue.set(state, 'patients', patients);
        },

        addPatientToList: (state, patient) => {
            state.patients.push(patient);
        },

        updatePatientData: (state, newPatientData) => {
            let index = state.patients.findIndex(pat => pat.id === newPatientData.id);
            state.patients.splice(index, 1, newPatientData);
            //console.log(index);
        },

        deletePatientByIndex: (state, index) => {
            state.patients.splice(index, 1);
        },

        setAsyncSavingPatient: (state, saving) => {
            state.asyncSavingPatient = saving;
        }
    },
    // -----------------------------------------------------------------
    actions: {
        fetch: async(context, payload) => {
            // don't fetch if we already have patients. 
            if (context.getters.patientCount != 0) return;
            // stuf to retrieve all the logged in user's todos from backend
            try {
                let { data } = await $axios.get(context.state.api_endpoint);
                //console.log("This is the data: " + data);
                data.map(patient => {
                        return patient.avatarColor = randomcolor({ luminosity: 'dark' });
                    })
                    //console.log("This is second data " + data);
                context.commit('setPatientList', data);

            } catch (error) {
                if (error.response) {
                    switch (error.response.status) {
                        // not logged in or token expired
                        case 401:
                            payload.router.push({ name: 'login', params: { show_alert: true } });
                            break;

                        default:
                            break;
                    }
                }
            }
        },
        create: (context, payload) => new Promise(async function(resolve, reject) {
            context.commit('setAsyncSavingPatient', true);
            try {
                let { data } = await $axios.post(context.state.api_endpoint, payload.patientData);
                context.commit('addPatientToList', data);
                resolve(data);
            } catch (error) {
                reject(error);
            }
            context.commit('setAsyncSavingPatient', false);
        }),

        read: (context, id) => new Promise(async function(resolve, reject) {
            // stuff to retrieve a particular todo data from the backend : CRUD READ ACTION
            let patient = context.getters.getPatientByID(id);
            console.log(patient);
            if (!patient) {
                try {
                    let { data } = await $axios.get(context.state.api_endpoint, { params: { id: id } });
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            } else {
                resolve(patient);
            }
        }),
        update: (context, payload) => new Promise(async function(resolve, reject) {
            // stuff to update a particular todo data to the backend : CRUD UPDATE ACTION
            context.commit('setAsyncSavingPatient', true);
            try {
                let { data } = await $axios.put(context.state.api_endpoint, payload.patientData);
                data.avatarColor = payload.patientData.avatarColor;
                context.commit('updatePatientData', data);
                resolve(data);
                //console.log(data);
            } catch (error) {
                reject(error);
            }
            context.commit('setAsyncSavingPatient', false);

        }),
        delete: (context, index) => new Promise(async function(resolve, reject) {
            let patient = context.getters.getPatientByIndex(index);
            try {
                let { data } = await $axios.delete(context.state.api_endpoint, { params: { id: patient.id } });
                resolve(data)
                context.commit('deletePatientByIndex', index);
            } catch (error) {
                reject(error);
            }
        })
    }
}
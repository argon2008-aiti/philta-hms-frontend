/** VUEX module for patients management in hospital management app **/
import { $axios } from "../utils/http";
import Vue from "vue";

export default {
    namespaced: true,
    // -----------------------------------------------------------------
    state: {
        api_endpoint: 'auth',
        currentUser: {},
        isLoggedIn: false,
        isLoggingIn: false
    },
    // -----------------------------------------------------------------
    getters: {

        currentUser: state => {
            let user = state.currentUser;
            console.log(user.id)
            if (user.id === undefined) {
                console.log('getting user from local storage...');
                user = JSON.parse(localStorage.getItem('currentUser'));
            }
            console.log(user.id);
            return user;
        },

        isLoggedIn: state => {
            return state.isLoggedIn;
        },

        isLoggingIn: state => {
            return state.isLoggingIn;
        },
        // getters and computed props on the todos data
        /*
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
            //
            let patient = state.patients.find(pat => pat.id === id);
            //console.log("This is the patient " + patient);
            return patient
        },

        asyncSavingPatient: state => {
            return state.asyncSavingPatient;
        }, */

    },
    // -----------------------------------------------------------------
    mutations: {
        // stuff to set todos data locally
        setCurrentUser: (state, user) => {
            Vue.set(state, 'currentUser', user);
            localStorage.setItem('currentUser', JSON.stringify(user));
        },

        setIsLoggingIn: (state, isLoggingIn) => {
            state.isLoggingIn = isLoggingIn;
        },

        setIsLoggedIn: (state, isLoggedIn) => {
            state.isLoggedIn = isLoggedIn;
        },
        /*
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
        }  */
    },
    // -----------------------------------------------------------------
    actions: {

        logIn: (context, payload) => new Promise(async function(resolve, reject) {
            $axios.post(context.state.api_endpoint + '/login', payload.data)
                .then((response) => {
                    console.log(response.data);
                    localStorage.token = response.data.token;
                    $axios.defaults.headers.common["Authorization"] =
                        "Bearer " + localStorage.token;
                    context.commit('setCurrentUser', response.data.user);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                    context.commit('setIsLoggingIn', false);
                });
        }),

        read: (context, token) => new Promise(async function(resolve, reject) {
            // stuff to retrieve a particular todo data from the backend : CRUD READ ACTION
            let patient = context.getters.getPatientByID(id);
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
        /*
        create: (context, payload) => new Promise(async function(resolve, reject) {
            //context.commit('setAsyncSavingPatient', true);
            console.log(payload.providerData);
            try {
                let { data } = await $axios.post(context.state.api_endpoint, payload.providerData);
                console.log(data);
                //context.commit('addPatientToList', data);
                resolve(data);
            } catch (error) {
                reject(error);
            }
            //context.commit('setAsyncSavingPatient', false);
        }),

        read: (context, id) => new Promise(async function(resolve, reject) {
            // stuff to retrieve a particular todo data from the backend : CRUD READ ACTION
            let patient = context.getters.getPatientByID(id);
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
        }) */
    }
}
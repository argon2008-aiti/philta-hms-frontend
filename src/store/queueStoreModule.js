import { $axios } from "../utils/http";
import Vue from "vue";

export default {
    namespaced: true,
    // -----------------------------------------------------------------
    state: {
        api_endpoint: 'queue',
        queue: [],
    },
    // -----------------------------------------------------------------
    getters: {

        queueCount: state => {
            return state.queue.length;
        },

        all: state => {
            return state.queue;
        },

        patientIndex: (state) => (id) => {
            return state.queue.findIndex(pat => pat._id === id);
        },

        mapPatientIDtoQueue: (state) => (patient_id) => {
            return state.queue.find(function(queue) {
                return queue.patient.id == patient_id
            });
        }

    },
    // -----------------------------------------------------------------
    mutations: {
        // stuff to set todos data locally
        setQueue: (state, patients) => {
            Vue.set(state, 'queue', patients);
        },

        addPatientToQueue: (state, patient) => {
            state.queue.push(patient);
        },

        deletePatientByID: (state, id) => {
            let index = state.queue.findIndex(pat => pat._id === id);
            state.queue.splice(index, 1);
        },

        movePatientUp: (state, id) => {
            let index = state.queue.findIndex(pat => pat._id === id);
            let patient = state.queue.splice(index, 1);
            state.queue.splice(index - 1, 0, patient[0]);
        },

        movePatientDown: (state, id) => {
            let index = state.queue.findIndex(pat => pat._id === id);
            let patient = state.queue.splice(index, 1);
            state.queue.splice(index + 1, 0, patient[0]);

        },

    },
    // -----------------------------------------------------------------
    actions: {

        fetch: (context) => new Promise(async function(resolve, reject) {
            try {
                let { data } = await $axios.get(context.state.api_endpoint);
                context.commit('setQueue', data);
                resolve(data);
                console.log(data);
            } catch (error) {
                reject(error);
            }
        }),

        create: (context, payload) => new Promise(async function(resolve, reject) {
            try {
                let { data } = await $axios.post(context.state.api_endpoint, payload);
                resolve(data);
            } catch (error) {
                reject(error);
            }
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

        delete: (context, id) => new Promise(async function(resolve, reject) {
            console.log(id);
            try {
                let { data } = await $axios.delete(context.state.api_endpoint, { params: { id: id } });
                resolve(data)
                context.commit('deletePatientByID', id);
            } catch (error) {
                reject(error);
            }
        })
    }
}
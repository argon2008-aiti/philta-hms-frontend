import { $axios } from "../utils/http";
import { isToday } from "../utils/isToday";

export default {
    namespaced: true,
    // -----------------------------------------------------------------
    state: {
        api_endpoint: 'report',
        reports: [],
    },
    // -----------------------------------------------------------------
    getters: {
        all: state => date => {
            return state.reports.filter(report => {
                return date.isSame(report.created_at, 'day');
            });
        },

        allRaw: state => {
            return state.reports;
        },

        reportsToday: state => {
            return state.reports.filter(report => {
                return isToday(new Date(report.created_at));
            });
        }
    },

    // -----------------------------------------------------------------
    mutations: {
        addReports: (state, reports) => {
            state.reports = reports;
        },

        appendToReports: (state, report) => {
            state.reports.push(report);
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

        }
    },
    // -----------------------------------------------------------------
    actions: {

        fetch: (context) => new Promise(async function(resolve, reject) {
            try {
                let { data } = await $axios.get(context.state.api_endpoint);
                context.commit('addReports', data);
                resolve(data);
                console.log(data);
            } catch (error) {
                reject(error);
            }
        }),

        create: (context, payload) => new Promise(async function(resolve, reject) {
            try {
                // first send documents
                if (payload.diagnostics.length > 0) {
                    let diagnostic_documents = [];
                    for (let diagnostic of payload.diagnostics) {
                        let form = new FormData();
                        form.append("title", diagnostic.title);
                        form.append("path", diagnostic.path);
                        form.append("file", diagnostic.file);
                        let { data } = await $axios.post("/document", form);
                        await diagnostic_documents.push(data._id);
                    }
                    payload.diagnostics = diagnostic_documents;
                }
                let { data } = await $axios.post(context.state.api_endpoint, payload);
                console.log(data);
                context.commit('appendToReports', data);
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
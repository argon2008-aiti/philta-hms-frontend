<template>
          <Modal v-model="modal_active"
                title="New Consultation Session"
                :z-index=5000
                @on-visible-change="visibleChange"
                class-name="vertical-center-modal">
                <Form ref="vitalsForm" label-position="top" :rules="formValidationRules" :model="vitalsForm">
                    <FormItem label="Patient:" prop="patient">
                        <Select v-model="vitalsForm.patient" 
                            placeholder="Select a Patient"
                            size="large"
                            :filterable="true"
                            :disabled="selectDisabled">
                            <Option v-for="patient in patients" :key="patient._id" :value="patient._id">
                            {{patient.full_name}}
                            </Option>
                        </Select>
                    </FormItem>
                    
                    <FormItem label="Blood Pressure:" prop="blood_pressure">
                        <Input v-model="vitalsForm.blood_pressure"
                            placeholder="Blood Pressure in mmHg"
                            size="large">
                            <span slot="prepend"><Icon type="ios-heart-outline"/></span>

                            <span slot="append" style="width:50px">mmHg</span>
                        </Input>
                    </FormItem>

                    <FormItem label="Heart Rate:" prop="heart_rate">
                        <Input v-model="vitalsForm.heart_rate"
                            placeholder="Heart beats per minute"
                            type="number"
                            size="large">
                            <span slot="prepend"><Icon type="ios-pulse-outline"/></span>
                        
                            <span slot="append" style="width:50px">BPM</span>
                        </Input>
                    </FormItem>

                    <FormItem label="Body Temperature:" prop="body_temperature">
                        <Input v-model="vitalsForm.body_temperature"
                            placeholder="Body temperature in degrees Celcius"
                            type="number"
                            size="large">
                            <span slot="prepend"><Icon type="ios-thermometer-outline"/></span>

                            <span slot="append" style="width:50px">&degC</span>
                        </Input>
                    </FormItem>
                </Form>

                <div slot="footer">
                    <Button type="text" 
                            size="large" 
                            @click="modal_active=false">
                            <span>Discard</span>
                    </Button>

                    <Button type="primary" 
                            size="large" 
                            @click="saveVitals()">
                            <span>Proceed</span>
                    </Button>
                </div>
          </Modal>
</template>

<script>
    export default {
        name: 'PatientVitalsModal',
        props: ['patient_id'],

        data() {
            return {
                modal_active: false,
                patients: '',
                selectDisabled: false,
                vitalsForm: {
                        patient: '',
                        blood_pressure: '',
                        heart_rate: '',
                        body_temperature: '',
                    },

                formValidationRules: {
                    patient: [
                        {required: true, message: "Select an Insurance Provider", trigger: 'blur'}
                    ],

                    blood_pressure: [
                        {required: true, message: "A policy number is required", trigger: 'blur'},
                    ],

                    heart_rate: [
                        {required: true, message: "Provide maximum cover", trigger: 'blur'}
                    ],

                    body_temperature: [
                        {required: true, message: "Provide maximum cover", trigger: 'blur'}
                    ],

                }
            }
        },

        methods: {
            saveVitals() {
                this.$store.dispatch('queue/create', this.vitalsForm)
                    .then((response) => {
                        if(response._id) {
                            let patient = this.$store.getters['patient/getPatientByID'](response.patient);
                            response.patient = patient;
                            this.$store.commit('queue/addPatientToQueue', response);
                            this.$socket.emit("Patient Added to Queue", response);
                            this.$root.$emit("vitalsModalOk", this.vitalsForm);
                            this.modal_active = false;
                        }
                    })
                    .catch((error) => {
                        console.log(error.response.status);
                        if(error.response.status == 500) {
                            this.$Message.error('Error saving vitals. Is the patient already queued?');
                        }
                    });

            },

            visibleChange(state) {
                if(!state) {
                    console.log(state);
                    this.$root.$emit("vitalsModalDiscarded");
                }
            }
        },

        mounted() {
            this.modal_active = true;
            this.$store.dispatch('patient/fetch')
                .then((patients) => {
                    console.log(patients);
                    this.patients = patients
                }).catch((error) => {
                    console.log(error);
                });

            if(this.patient_id) {
                console.log("Patient provided");
                this.selectDisabled = true;
                this.vitalsForm.patient = this.patient_id;
            }

        }

    }
</script>

<style scoped>
    .avatar-container {
        background: white;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    .logo-hint {
        color: #bbb;
        text-align: center;
        cursor: pointer;
    }

</style>
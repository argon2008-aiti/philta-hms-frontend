<template>
<div class="page-container" ref="container">
    <div class="page-header">
        <span class="header-title">Patient Details</span>
        <div style="position: absolute; right: 160px; top: 25px; font-size: 16px; display: inline;">
            <Icon type="ios-person-outline" size="24" style=""></Icon>
            {{currentPatient.full_name}}
        </div>
        <span>
            <Button type="primary" 
                    size="large"
                    style="float: right"
                    @click="seeDoctor">
                    See Doctor
            </Button>
        </span>
    </div>
    <div style="margin-top: 60px">
        <p class="section-header-text">BIO DATA</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
                <Row :gutter=0>
                    <Col span="7" class="patient-bio-container">
                        <div><Icon type="ios-person-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.full_name}}</span>
                            <span class="badge-span">{{currentPatient.gender}}</span>
                        </div>
                        <div><Icon type="ios-barcode-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.patient_id}}</span>
                        </div>
                        <div><Icon type="ios-call-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.phone_number}}</span>
                        </div>
                    </Col>
                    <Col span="7" class="patient-bio-container">
                        <div><Icon type="ios-calendar-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.date_of_birth | formatDate}}</span>
                            <span class="badge-span">{{currentPatient.date_of_birth | getAge}}</span>
                        </div>
                        <div><Icon type="ios-mail-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.email}}</span>
                        </div>
                    </Col>
                    <Col span="7" class="patient-bio-container">
                        <div><Icon type="ios-briefcase-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.occupation}}</span>
                        </div>
                        <div><Icon type="ios-podium-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.company}}</span>
                        </div>
                        <div><Icon type="ios-home-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.residential_address}}</span>
                        </div>
                    </Col>
                    <Col span="3">
                        <Button 
                            type="outline" 
                            icon="md-create" 
                            style="margin-top: 15px;"
                            @click="edit_patient_modal=true">
                            Edit Info</Button>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
    <div style="margin-top: 30px">
    <p class="section-header-text">PREVIOUS VISITS</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
                <div v-if="currentPatient.insurance_policy.scheme=='None'" class="insurance-policy-container">
                    <img src="../assets/no_insurance.png" alt="no insurance" srcset="">
                    <p class="no-insurance-text">Patient Has No Insurance Policy!</p>
                    <Button type="primary">Add Insurance Policy</Button>
                </div>
            </div>
        </Card>
    </div>

    <div style="margin-top: 30px">
    <p class="section-header-text">INSURANCE POLICY</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
                <div v-if="insurancePolicy.policy_number==null" class="insurance-policy-container">
                    <img src="../assets/no_insurance.png" alt="no insurance" srcset="">
                    <p class="no-insurance-text">Patient Has No Insurance Policy!</p>
                    <Button type="primary" @click="addInsurancePolicy">Add Insurance Policy</Button>
                </div>

                <div v-else>
                    <Row>
                        <Col span="8">
                           <img :src="providerLogoUrl" 
                                alt="insurance logo" srcset="" 
                                class="provider-logo">
                        </Col>
                        <Col span="13" class="patient-insurance-container">
                            <div><Icon type="ios-podium-outline" size="24"></Icon>
                                <span class="patient-info-inline">{{insurancePolicy.provider.company_name}}</span>
                            </div>
                            <div><Icon type="ios-barcode-outline" size="24"></Icon>
                                <span class="patient-info-inline">{{insurancePolicy.policy_number}}</span>
                            </div>
                            <div><Icon type="ios-umbrella-outline" size="24"></Icon>
                                <span class="patient-info-inline">GHS {{insurancePolicy.maximum_cover}}</span>
                            </div>
                            <div><Icon type="ios-calendar-outline" size="24"></Icon>
                                <span class="patient-info-inline">{{insurancePolicy.policy_end | formatDate}}</span>
                                <span class="badge-span expired" v-if="expired(insurancePolicy.policy_end)">expired</span>
                                <span class="badge-span" v-else>{{insurancePolicy.policy_end | daysUntilExpire}} days left </span>
                            </div>
                        </Col>
                        <Col span="3">
                            <Button 
                                type="outline" 
                                icon="md-create" 
                                style="margin-top: 15px;"
                                @click="editInsurancePolicy">
                                Edit Info</Button>
                        </Col>
                    </Row>

                </div>
            </div>
        </Card>
    </div>

    <!--
    <div style="margin-top: 30px">
    <p class="section-header-text">BILLS AND PAYMENTS</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
                <div v-if="currentPatient.insurance_policy.scheme=='None'" class="insurance-policy-container">
                    <img src="../assets/no_insurance.png" alt="no insurance" srcset="">
                    <p class="no-insurance-text">Patient Has No Insurance Policy!</p>
                    <Button type="primary">Add Insurance Policy</Button>
                </div>
            </div>
        </Card>
    </div>

    -->

          <Modal v-model="edit_patient_modal"
                class="add-patient-modal"
                title="Edit Patient"
                :z-index=5000
                class-name="vertical-center-modal">
                <AddPatientForm :patient="id"></AddPatientForm>

                <div slot="footer">
                    <Button type="text" 
                            size="large" 
                            @click="edit_patient_modal=false">
                            <span>Discard</span>
                    </Button>

                    <Button type="primary" 
                            size="large" 
                            :loading="asyncSavingPatient"
                            @click="modalOnOk">
                            <span>Save</span>
                    </Button>
                </div>
          </Modal>
</div>
</template>

<script>
import moment from 'moment';

import AddPatientForm from '@/components/AddPatientForm';
import NewInsurancePolicyModal from '@/components/AddInsurancePolicy'
import Vue from 'vue'
import store from '../store/index'
import { $api_base_url } from "../utils/http";
    export default {
        props: ["id"],
        name: 'PatientDetails',

        components: {
            AddPatientForm
        },

        data() {
            return {
                current_patient: '',
                edit_patient_modal: false,
                insuranceModal: null
            }
        },

        methods: {
            modalOnOk() {
                this.$root.$emit("newPatientSaveRequest");
            }, 

            updatePatientData() {
                this.$store.dispatch('patient/read', this.id).then((result) => {
                this.current_patient = result; 
                }).catch((err) => {
                console.log(error);
                });
            },


            deletePatient: function() {
                var patientID = this.currentPatient.id;
                var patientIndex = this.$store.getters['patient/getPatientIndex'](patientID);
                this.$Modal.confirm({
                        title: this.currentPatient.full_name,
                        content: '<p>Are you sure you want to delete this patient?</p>',
                        loading: true,
                        okText: "Yes",
                        cancelText: "No",
                        onOk: () => {
                            this.patient_overview = false;
                            this.$store.dispatch('patient/delete', patientIndex)
                                    .then((deletedPatient) => {
                                        this.$Message.info("Patient deleted successfully");
                                        this.$Modal.remove();
                                    }).catch((error) => {
                                        console.log(error);
                                        this.$Message.error("Unable to delete Patient");
                                    })
                        }
                    });
            },

            addInsurancePolicy() {
                let ComponentClass = Vue.extend(NewInsurancePolicyModal);
                this.insuranceModal = new ComponentClass({store,
                    propsData: { patient_id: this.currentPatient.id, 
                                    title: "Add Insurance Policy"}
                })
                this.insuranceModal.$mount() // pass nothing
                this.$refs.container.appendChild(this.insuranceModal.$el)
            },

            editInsurancePolicy() {
                let ComponentClass = Vue.extend(NewInsurancePolicyModal);
                this.insuranceModal = new ComponentClass({store,
                    propsData: { patient_id: this.currentPatient.id, 
                                    title: "Edit Insurance Policy",
                                    insurance_data: this.insurancePolicy }
                })
                this.insuranceModal.$mount() // pass nothing
                this.$refs.container.appendChild(this.insuranceModal.$el)
            },

            expired: function(date) {
                let today = moment();
                let expire_date = moment(date);
                return expire_date.diff(today, 'days') < 0;
            },

            seeDoctor: function() {
                this.$router.push({name: 'consultations', params: {'id': this.id}});
            }
        },

        computed: {
            asyncSavingPatient: function() {
                return this.$store.getters['patient/asyncSavingPatient'];
            },

            insurancePolicy: function() {
                return this.currentPatient.insurance_policy;
            },

            providerLogoUrl: function() {
                return $api_base_url + '/upload/' + this.insurancePolicy.provider.logo_url;
            },

            currentPatient: function() {
               return this.$store.getters['patient/getPatientByID'](this.id);
            }

        },

        created() {
            console.log(this.id);
        },

        mounted() {

            /*this.$store.dispatch('patient/read', this.id).then((result) => {
               this.currentPatient = result; 
               console.log(result);
            }).catch((err) => {
               console.log(error);
            });*/

            this.$store.dispatch('patient/fetch');

            this.$root.$on("newPatientSaveSuccess", (data) => {
                this.edit_patient_modal = false;
                this.updatePatientData();
                this.$Message.success({
                top: 50,
                duration: 5,
                render: h => {
                    return h('div', [
                        h('p', data.full_name + " has been saved successfully")
                    ]);
                   }
                });

            });

            this.$root.$on("insurancePolicyAdded", (data) => {
                console.log("Insurance Policy Added");
                this.insuranceModal.destroy();
            });
        } 
        
    }
</script>

<style lang="css" scoped>
    .page-container {
      background: #fcfcfc;
      padding: 40px 20px;
    }

    .page-header .header-title {
      font-size: 24px;
      letter-spacing: 2px;
      display: inline-block;
    }

    .page-header {
        background: #fff;
        position: fixed;
        margin-left: 240px;
        padding: 20px 20px;
        z-index: 2;
        top: 0;
        left: 0;
        right: 0;
        height: auto;
        -webkit-box-shadow: 0px 4px 4px -4px #dcdedc;
            -mox-box-shadow: 0px 4px 4px -4px #dcdedc;
        box-shadow: 0px 4px 4px -3px #dcdedc;
    }


    .page-contents {
      background: white;
      margin-top: 1px;
      padding: 10px;
    }

    .patient-info-inline {
      margin-left: 10px;
      font-size: 14px;
    }

    .patient-bio-container > * ,
    .patient-insurance-container > * {
      margin: 20px 0px;
    }

    .ivu-badge > .patient-info-badge {
        background: #aaa !important;
        margin-left: 10px;
    }


    .insurance-policy-container {
        text-align: center;
        padding: 20px;
    }

    .no-insurance-text {
        margin-bottom: 20px;
        color: #a8a8a8;
        font-size: 14px;
    }

    .provider-logo {
        max-width: 90%;
        height: auto;
        margin-top: 10px;

    }
</style>

<style>
    .badge-span {
        margin-left: 5px;
        font-weight: bold;
        font-size: 12px;
        border-radius: 10px;
        padding: 2px 6px;
        background: #e6ebf1;
        color: #808695;
        text-align: center;
        height: 20px;
        white-space: nowrap;
        vertical-align: center;
        position: relative;
    }

    .badge-span.expired {
        background: #d7888a;
        color: #860406;
    }
</style>
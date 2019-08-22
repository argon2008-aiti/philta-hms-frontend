<template>
<div class="page-container">
    <div class="page-header">
        <span class="header-title">Patient Details</span>
        <div style="position: absolute; right: 120px; font-size: 16px; display: inline;">
            <Icon type="ios-person-outline" size="32" style="margin-bottom: 5px;"></Icon>
            {{currentPatient.full_name}}
        </div>
        <span>
            <Button type="error" 
                    size="large"
                    style="float: right">
                    Delete
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

    <!--
    <div style="margin-top: 30px">
    <p class="section-header-text">INSURANCE POLICY</p>
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
import AddPatientForm from '@/components/AddPatientForm';
    export default {
        props: ["id"],
        name: 'PatientDetails',

        components: {
            AddPatientForm
        },

        data() {
            return {
                currentPatient: '',
                edit_patient_modal: false
            }
        },

        methods: {
            modalOnOk() {
                this.$root.$emit("newPatientSaveRequest");
            }, 

            updatePatientData() {
                this.$store.dispatch('patient/read', this.id).then((result) => {
                this.currentPatient = result; 
                }).catch((err) => {
                console.log(error);
                });
            }
        },

        computed: {
            asyncSavingPatient: function() {
                return this.$store.getters['patient/asyncSavingPatient'];
            },
        },

        created() {
            console.log(this.id);
        },

        mounted() {
            this.$store.dispatch('patient/read', this.id).then((result) => {
               this.currentPatient = result; 
            }).catch((err) => {
               console.log(error);
            });


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

    .section-header-text {
        color: #9F9F9F;
        font-size: 11px;
        letter-spacing: 2px;
        /*font-weight: bold;*/
    }

    .section-card {
        margin-left: 10px;
        margin-top: 5px;
    }

    .patient-info-inline {
      margin-left: 10px;
      font-size: 14px;
    }

    .patient-bio-container > * {
      margin: 20px 0px;
    }

    .ivu-badge > .patient-info-badge {
        background: #aaa !important;
        margin-left: 10px;
    }

    .badge-span {
        margin-left: 10px;
        font-family: 'Helvetica Neue';
        font-weight: bold;
        font-size: 12px;
        line-height: 18px;
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

    .insurance-policy-container {
        text-align: center;
        padding: 20px;
    }

    .no-insurance-text {
        margin-bottom: 20px;
        color: #a8a8a8;
        font-size: 14px;
    }
</style>
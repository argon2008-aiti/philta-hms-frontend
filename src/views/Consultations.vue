<template>
  <div class="page-container" ref="container">
    <div class="page-header">
        <span class="header-title">Consultations</span>
        <span style="margin-left: 5px; text-align: center;">
            <Badge :count="queueCount" class-name="patient-count-badge"></Badge>
        </span>
        <span>
            <Button type="primary" 
                    size="large"
                    style="float: right"
                    @click="addNewVitals">
                    New Session
            </Button>
        </span>
    </div>
    <div id="consultation-queue-container" ref="patientQueue">
      <QueuedPatient v-for="patient in currentQueue" 
                     v-bind:key="patient._id"
                     :patient_data="patient">
      </QueuedPatient>

    </div>
    <Row :gutter="16">
        <Col span="16">
            <p class="section-header-text">CONSULTATION HISTORY</p>
            <Card dis-hover style="min-height:80vh">
              <div class="page-contents">
                <div v-if="allReports.length > 0">
                  <MedicalReportItem v-for="report in allReports" :report="report" :key="report.id">
                  </MedicalReportItem>
                </div>
                <div v-else 
                        style="text-align: center; 
                              vertical-align: middle;
                              margin-top: 100px">
                  <NoDataView message="No medical record to show">
                  </NoDataView>
                </div>
              </div>
            </Card>
        </Col>
        <Col span="8">
            <p class="section-header-text">TODAY</p>
            <Card dis-hover style="min-height:30vh">
              <div class="page-contents">
                <div v-if="reportsToday.length > 0">
                  <MedicalReportItemToday v-for="report in reportsToday" :report="report" :key="report.id">
                  </MedicalReportItemToday>
                </div>
                <div v-else 
                        style="text-align: center; 
                              vertical-align: middle;
                              margin-top: 0px">
                  <NoDataView message="No patient has been seen today">
                  </NoDataView>
                </div>
              </div>
            </Card>
        </Col>
    </Row>
  </div>
</template>

<script>
import Vue from 'vue'
import PatientVitalsModal from '@/components/PatientVitalsModal.vue'
import MedicalReportModal from '@/components/MedicalReportModal.vue'
import MedicalReportItem from '@/components/MedicalReportItem.vue'
import MedicalReportItemToday from '@/components/MedicalReportItemToday.vue'
import store from '../store/index'
import QueuedPatient from '@/components/QueuedPatient.vue'
import NoDataView from '@/components/NoDataView.vue'
export default {
        props: ["id"],
        components: {'QueuedPatient': QueuedPatient, 
                     'MedicalReportItem': MedicalReportItem,
                     'MedicalReportItemToday': MedicalReportItemToday,
                     'NoDataView': NoDataView,
                     },
        data() {
            return {
              vitalsModal: null
            }
        },

        methods: {

            addNewVitals() {
                let ComponentClass = Vue.extend(PatientVitalsModal);
                this.vitalsModal = new ComponentClass({store, 
                       propsData: {patient_id: this.id}
                       });
                this.vitalsModal.$root = this.$root;
                this.vitalsModal.$mount() // pass nothing
                this.$refs.container.appendChild(this.vitalsModal.$el)
            },

            addNewReport(patient) {
                let ComponentClass = Vue.extend(MedicalReportModal);
                this.medicalReportModal = new ComponentClass({store, 
                       propsData: {patient_data: patient}
                       });
                this.medicalReportModal.$root = this.$root;
                this.medicalReportModal.$mount() // pass nothing
                this.$refs.container.appendChild(this.medicalReportModal.$el)
            },

        },

        computed: {
             
             currentQueue() {
                  return this.$store.getters['queue/all'];
             },

             queueCount() {
                  return this.$store.getters['queue/queueCount'];
             },

             allReports() {
                  return this.$store.getters['report/all'];
             },

             reportsToday() {
                  return this.$store.getters['report/reportsToday'];
             },

        },

        created() {
             this.$store.dispatch('queue/fetch');
        },

        mounted() {

            this.$root.$on("vitalsModalDiscarded", () => {
                this.id = null;
            });

            this.$root.$on("vitalsModalOk", () => {
                this.id = null;
            });

            this.$root.$on("consultPatient", (patient_data) => {
                this.addNewReport(patient_data);
            });

            this.$store.dispatch('report/fetch');

            if(this.id) {
              this.addNewVitals();
            }

        } 
        
}
</script>

<style scoped>
    #consultation-queue-container {
      margin-top: 50px;
      display: flex;
      overflow-x: scroll;
    }

    .section-header-text {
      margin-bottom: 5px;
    }

</style>

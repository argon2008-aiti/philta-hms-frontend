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
              <div slot="title" style="margin-top: 20px;">
                <Row gutter=8>
                   <Col span="6" id="report-date-title">{{report_date.format("dddd, Do MMM., YYYY")}}</Col>
                   <Col span="10">
                      <Input></Input>
                   </Col>
                   <Col span="2"><div style="width: 100%; height: 50px;"></div></Col> 
                   <Col span="4">
                      <DatePicker type="date" 
                                  @on-change="reportDateChanged"
                                  :options="date_picker_options"
                                  placeholder="Go to Date">
                      </DatePicker>
                   </Col>
                </Row>
              </div>
              <div slot="extra" style="margin-top: 20px;">
                <ButtonGroup class="pager-button-group">
                    <Button icon="ios-arrow-back" 
                          class="pager-button"
                          :disabled="reportDateForwardLimit"
                          @click="forwardReportDate"></Button>
                    <Button icon="ios-arrow-forward" 
                          class="pager-button"
                          @click="backtrackReportDate"></Button>
                </ButtonGroup> 
              </div>
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
                  <MedicalReportItem v-for="report in reportsToday" :report="report" :key="report.id">
                  </MedicalReportItem>
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
import store from '../store/index'
import QueuedPatient from '@/components/QueuedPatient.vue'
import NoDataView from '@/components/NoDataView.vue'
import moment from 'moment'
export default {
        props: ["id"],
        components: {'QueuedPatient': QueuedPatient, 
                     'MedicalReportItem': MedicalReportItem,
                     'NoDataView': NoDataView,
                     },
        data() {
            return {
              vitalsModal: null,
              report_date: moment().subtract(1, 'days'),
              date_picker_options: {
                    disabledDate (date) {
                      return moment().isSameOrBefore(moment(date), 'days');
                    }
                },
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

            forwardReportDate() {
              if(!this.reportDateForwardLimit) {
                 this.report_date = moment(this.report_date).add(1, 'days')
              }

            },

            backtrackReportDate() {
              this.report_date = moment(this.report_date).subtract(1, 'days');
            },

            reportDateChanged(new_date) {
              if(new_date) {
                  if(this.validReportDate(moment(new_date))) {
                     this.report_date = moment(new_date);
                  }

                  else {
                    this.$Notice.error({
                      title: 'Invalid Date ' + new_date,
                      desc:'Date provided must be in the past!'
                    });
                  }
              }
            },

            validReportDate(date) {
                return moment(date).isBefore(moment(), "days");
            }

        },

        computed: {
             
             currentQueue() {
                  return this.$store.getters['queue/all'];
             },

             queueCount() {
                  return this.$store.getters['queue/queueCount'];
             },

             allReports() {
                  return this.$store.getters['report/all'](this.report_date);
             },

             reportsToday() {
                  let reports = this.$store.getters['report/reportsToday'];
                  return reports.reverse();
             },

             currentReportDate() {
               return this.report_date;
             },

             reportDateForwardLimit() {
                  let date_limit = moment(this.report_date);
                  return !this.validReportDate(date_limit.add(1, 'days'));
                  // let today = moment();
                  // let difference = moment.duration(today.diff(this.report_date)).asDays();
                  // return Math.floor(difference) <= 1;
             }

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
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    #consultation-queue-container::-webkit-scrollbar {
      display: none;
    }

    .section-header-text {
      margin-bottom: 5px;
    }

    #report-date-title {
      font-size: 14px;
      font-weight: 400;
      margin-top: 10px;
      letter-spacing: 0.5px;
    }
</style>

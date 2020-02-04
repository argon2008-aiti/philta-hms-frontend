<template>
<div class="page-container" ref="container">
    <div class="main-contents" v-if="report">
        <div class="page-header">
            <span class="header-title">Medical Report Details</span>
            <div style="position: absolute; right: 250px; top: 25px; font-size: 16px; display: inline;">
                <Icon type="ios-person-outline" size="24" style=""></Icon>
                {{report.patient.full_name}}
            </div>
            <span style="position: absolute; right: 40px; top: 26px; font-size: 15px">
                <Icon type="ios-calendar-outline" size="22" style=""></Icon>
                {{report.created_at | formatDate }}
            </span>
        </div>
        <div style="margin-top: 60px">
            <p class="section-header-text">SUBJECTIVE</p>
            <Card dis-hover class="section-card">
                <div class="page-contents">
                    <Row :gutter=20>
                        <Col span="8" class="patient-bio-container">
                             <div class="report-item" style="margin-top: 40px;">
                                 <p class="report-item-title">
                                     Chief Complaint (CC):
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.chief_complaint}}
                                 </p>
                             </div>

                             <div class="report-item">
                                 <p class="report-item-title">
                                     Condition Description:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.condition_description}}
                                 </p>
                             </div>
                        </Col>
                        <Col span="8" class="patient-bio-container">
                            <Divider position="center" size="small">History of Present Condition (HPC)</Divider>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Condition Onset:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.condition_onset}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Condition Duration:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.condition_duration}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Aggravating Factors:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.aggravating_factors}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Alleviating Factors:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.alleviating_factors}}
                                 </p>
                             </div>
                        </Col>
                        <Col span="8" class="patient-bio-container">
                            <Divider position="center" size="small">Medical Profile</Divider>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Social/Employment Activities:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.employment_activities}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Chronic Conditions:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.chronic_diseases}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Current Medications:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.current_medications}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Ocular Surgical History:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.surgical_history}}
                                 </p>
                             </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
        <div style="margin-top: 30px">
            <p class="section-header-text">OBJECTIVE</p>
            <Card dis-hover class="section-card">
                <div class="page-contents">
                    <Row :gutter=20>
                        <Col span="8" class="patient-bio-container">
                            <Divider position="center" size="small">Visual Acuity (VA)</Divider>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Snellen Test Unaided:
                                 </p> 
                                 <p class="report-item-contents" v-if="!report.snellen_test_unaided.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.snellen_test_unaided.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.snellen_test_unaided.left_eye}}</span>
                                 </p>
                             </div>

                             <div class="report-item">
                                 <p class="report-item-title">
                                     Snellen Test Aided:
                                 </p>
                                  <p class="report-item-contents" v-if="!report.snellen_test_aided.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.snellen_test_aided.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.snellen_test_aided.left_eye}}</span>
                                 </p>
                             </div>

                             <div class="report-item">
                                 <p class="report-item-title">
                                     Counting Finger:
                                 </p>
                                 <p class="report-item-contents" v-if="!report.counting_finger.tested">
                                     Not Tested
                                 </p>
                         
                                 <p class="report-item-contents" v-else>
                                     {{report.condition_description}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Hand Motion:
                                 </p>
                                 <p class="report-item-contents" v-if="!report.hand_motion.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     {{report.condition_description}}
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Light Perception:
                                 </p>
                                 <p class="report-item-contents" v-if="!report.light_perception.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     {{report.condition_description}}
                                 </p>
                             </div>
                        </Col>
                        <Col span="8" class="patient-bio-container">
                            <Divider position="center" size="small">Refraction Test</Divider>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Spherical Power(SPH):
                                 </p> 
                                 <p class="report-item-contents" v-if="!report.spherical_power.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.spherical_power.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.spherical_power.left_eye}}</span>
                                 </p>
                             </div>

                             <div class="report-item">
                                 <p class="report-item-title">
                                     Cylindrical Power(CYL):
                                 </p>
                                  <p class="report-item-contents" v-if="!report.cylindrical_power.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.cylindrical_power.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.cylindrical_power.left_eye}}</span>
                                 </p>
                             </div>

                             <div class="report-item">
                                 <p class="report-item-title">
                                     Axes / Meridian(X):
                                 </p>
                                 <p class="report-item-contents" v-if="!report.axes.tested">
                                     Not Tested
                                 </p>
                         
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.axes.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.axes.left_eye}}</span>
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Add Power(Presbyopia):
                                 </p>
                                 <p class="report-item-contents" v-if="!report.presbyopia_power.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.presbyopia_power.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.presbyopia_power.left_eye}}</span>
                                 </p>
                             </div>
                        </Col>
                        <Col span="8" class="patient-bio-container">
                            <Divider position="center" size="small">Pupillometry</Divider>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Shape and Accommodation:
                                 </p> 
                                 <p class="report-item-contents" v-if="!report.pupil_shape_accomodation.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.pupil_shape_accomodation.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.pupil_shape_accomodation.left_eye}}</span>
                                 </p>
                             </div>

                             <div class="report-item">
                                 <p class="report-item-title">
                                     Diameter(Dark Conditions):
                                 </p>
                                  <p class="report-item-contents" v-if="!report.pupil_diameter.dim.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.pupil_diameter.dim.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.pupil_diameter.dim.left_eye}}</span>
                                 </p>
                             </div>

                             <div class="report-item">
                                 <p class="report-item-title">
                                     Diameter(Normal Conditions):
                                 </p>
                                 <p class="report-item-contents" v-if="!report.pupil_diameter.light.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.pupil_diameter.light.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.pupil_diameter.light.left_eye}}</span>
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Direct Reactivity to Light:
                                 </p>
                                 <p class="report-item-contents" v-if="!report.direct_light_reactivity.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.direct_light_reactivity.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.direct_light_reactivity.left_eye}}</span>
                                 </p>
                             </div>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Consensual Reactivity to Light:
                                 </p>
                                 <p class="report-item-contents" v-if="!report.consensual_light_reactivity.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.consensual_light_reactivity.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.consensual_light_reactivity.left_eye}}</span>
                                 </p>
                             </div>
                        </Col>
                    </Row>
                    <Row :gutter=20 style="margin-top: 50px;">
                        <Col span="16" class="patient-bio-container">
                            <Divider position="center" size="small">Confrontational Visual Fields</Divider>
                             <Row gutter=24>
                                 <Col span="12" style="text-align: center">
                                     <div class="report-item">
                                         <p class="report-item-title">
                                             Right Eye Visual Field:
                                         </p> 
                                         <p class="report-item-contents" v-if="!report.visual_fields_right.tested">
                                             Not Tested
                                         </p>
                                         <!-- <p class="report-item-contents" v-else>
                                             <span>RE: {{report.spherical_power.right_eye}}</span>
                                             <span style="margin-left: 50px;">LE: {{report.spherical_power.left_eye}}</span>
                                         </p> -->
                                         <VisualFieldsImage 
                                               :visual_field="report.visual_fields_right" 
                                               c_id="right-canvas"
                                               v-if="report.visual_fields_right.tested"
                                               style="margin-top: 20px;">
        

                                         </VisualFieldsImage>
                                     </div>
                                 </Col>
    
                                 <Col span="12" style="text-align: center">
                                     <div class="report-item">
                                         <p class="report-item-title">
                                             Left Eye Visual Field:
                                         </p>
                                          <p class="report-item-contents" v-if="!report.visual_fields_left.tested">
                                             Not Tested
                                         </p>
                                         <!-- <p class="report-item-contents" v-else>
                                             <span>RE: {{report.cylindrical_power.right_eye}}</span>
                                             <span style="margin-left: 50px;">LE: {{report.cylindrical_power.left_eye}}</span>
                                         </p> -->
                                         <VisualFieldsImage 
                                               :visual_field="report.visual_fields_left" 
                                               c_id="left-canvas"
                                               v-if="report.visual_fields_left.tested"
                                               style="margin-top: 20px;">

                                         </VisualFieldsImage>
                                     </div>
                                 </Col>
                             </Row>
                        </Col>
                        <Col span="8" class="patient-bio-container">
                            <Divider position="center" size="small">Tonometry</Divider>
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Intraocular Pressure:
                                 </p> 
                                 <p class="report-item-contents" v-if="!report.intraocular_pressure.tested">
                                     Not Tested
                                 </p>
                                 <p class="report-item-contents" v-else>
                                     <span>RE: {{report.intraocular_pressure.right_eye}}</span>
                                     <span style="margin-left: 50px;">LE: {{report.intraocular_pressure.left_eye}}</span>
                                 </p>
                             </div>

                        </Col>
                    </Row>
                </div>
            </Card>
        </div>

        <Row :gutter="12">
            <Col span="16">
                <div style="margin-top: 30px">
                    <p class="section-header-text">ASSESSMENT</p>
                    <Card dis-hover class="section-card">
                        <div class="page-contents">
                             <div class="report-item">
                                 <p class="report-item-title">
                                     Physician's Assessment:
                                 </p>
                                 <p class="report-item-contents">
                                     {{report.assessment}}
                                 </p>
                             </div>
                        </div>
                    </Card>
                </div>
            </Col>
            <Col span="8">
                <div style="margin-top: 30px">
                    <p class="section-header-text">DIAGNOSTICS REPORTS</p>
                    <Card dis-hover class="section-card">
                        <div class="page-contents">
                             <div class="report-item" v-for="doc in diagnostics_documents" :key="doc._id">
                                 <p class="report-item-title">
                                     {{doc.title}}
                                 </p> 
                                 <p class="report-item-contents">
                                    <a :href='createDocUrl(doc.path)'>{{doc.path}}</a>
                                 </p>
                             </div>
                        </div>
                    </Card>
                </div>
            </Col>
        </Row>
        <div style="margin-top: 30px">
            <p class="section-header-text">PLAN</p>
            <Card dis-hover class="section-card">
                <div class="page-contents">
                    <div class="report-item">
                        <p class="report-item-title">
                            Physician's Plan:
                        </p>
                        <p class="report-item-contents">
                            {{report.plan}}
                        </p>
                    </div>

                    <div class="report-item">
                        <p class="report-item-title">
                            Prescriptions:
                        </p>
                        <p class="report-item-contents">
                            {{report.prescription}}
                        </p>
                    </div>
                    
                    <div class="report-item">
                        <p class="report-item-title">
                            Date for Review:
                        </p>
                        <p class="report-item-contents">
                            {{report.review_date | formatDate}}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    </div>
    <div class="no-report-container" v-else>
        <NoDataView message="No Report Has Been Selected!" style="padding-top: 30vh;"></NoDataView>
    </div>
</div>
</template>

<script>
import moment from 'moment';
import NoDataView from '@/components/NoDataView.vue'
import VisualFieldsImage from '@/components/VisualFieldsImage.vue'
    export default {
        props: ["report"],
        name: 'MedicalReportDetails',

        components: {
            'NoDataView':NoDataView,
            'VisualFieldsImage': VisualFieldsImage,
        },

        data() {
            return {
                diagnostics: [],
            }
        },

        methods: {
            createDocUrl(url) {
                return "http://localhost:3000/upload/" + url;
            },

            getDocument(id) {

                this.$store.dispatch('report/read_diagnostics', id)
                    .then((result) => {
                        this.diagnostics.push(result);
                        
                    }).catch((err) => {
                        console.log(err);
                    });

                }
        },

        computed: {

            diagnostics_documents: function() {
                return this.diagnostics;
            }
        },

        created() {
            this.report.diagnostics.map((id)=>{
                this.getDocument(id);
            })
        },

        mounted() {

        } 
        
    }
</script>

<style lang="css" scoped>
    .main-contents {
      background: #fcfcfc;
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

    .no-report-container {
        text-align: center;
        height: 80vh;
        margin: -40px -20px;
    }

    .report-item {
        margin: 10px 0px 20px 10px;
    }

    .report-item-title {
        font-weight: 600;
    }

    .report-item-contents {
        margin-left: 15px;
        font-style: italic;
        padding-bottom: 10px;
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
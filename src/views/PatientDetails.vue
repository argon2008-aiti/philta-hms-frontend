<template>
<div class="page-container">
    <div class="page-header">
        <span class="header-title">Patient Details</span>
        <span>
            <Button type="error" 
                    size="large"
                    style="float: right">
                    Delete
            </Button>
        </span>
    </div>
    <div style="margin-top: 50px">
        <p class="section-header-text">BIO DATA</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
                <Row :gutter=0>
                    <Col span="7" class="patient-bio-container">
                        <div><Icon type="ios-person-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.full_name}}</span>
                            <span class="badge-span">{{currentPatient.gender}}</span>
                        </div>
                        <div><Icon type="ios-call-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.phone_number}}</span>
                        </div>
                        <div><Icon type="ios-calendar-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.date_of_birth | formatDate}}</span>
                            <!--
                            <Badge :text="currentPatient.date_of_birth | getAge" class-name="patient-info-badge"
                                    type="normal"
                                    style="margin-left: 10px; font-family: 'Helvetica Neue'; font-weight: bold;">
                            </Badge>
                            -->
                            <span class="badge-span">{{currentPatient.date_of_birth | getAge}}</span>
                        </div>
                    </Col>
                    <Col span="7" class="patient-bio-container">
                        <div><Icon type="ios-mail-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.email}}</span>
                        </div>
                        <div><Icon type="ios-briefcase-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.occupation}}</span>
                        </div>
                        <div><Icon type="ios-podium-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.company}}</span>
                        </div>
                    </Col>
                    <Col span="7" class="patient-bio-container">
                        <div><Icon type="ios-home-outline" size="24"></Icon>
                            <span class="patient-info-inline">{{currentPatient.residential_address}}</span>
                        </div>
                    </Col>
                    <Col span="3">
                        <Button type="outline" icon="md-create" style="margin-top: 15px;">
                            Edit Info</Button>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
    <div style="margin-top: 30px">
    <p class="section-header-text">INSURANCE POLICY</p>
        <Card dis-hover class="section-card">
            <div class="page-contents">
            </div>
        </Card>
    </div>
</div>
</template>

<script>
    export default {
        props: ["id"],
        name: 'PatientDetails',
        data() {
            return {
                currentPatient: ''
            }
        },

        mounted() {
            //this.currentPatient = this.$store.getters['patient/getPatientByID'](this.id);
            this.$store.dispatch('patient/read', this.id).then((result) => {
               this.currentPatient = result; 
            }).catch((err) => {
               console.log(error);
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
        color: #AAA;
        font-size: 12px;
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

    
</style>
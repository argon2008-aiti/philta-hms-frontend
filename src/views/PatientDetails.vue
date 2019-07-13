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
    <Card dis-hover style="margin-top: 50px">
        <div class="page-contents">
            <h1>{{currentPatient.full_name}}</h1>
        </div>
    </Card>
    <div>INSURANCE POLICY</div>
    <Card dis-hover>
        <div class="page-contents">
            <h1>{{currentPatient.full_name}}</h1>
        </div>
    </Card>
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
            this.currentPatient = this.$store.getters['patient/getPatientByID'](this.id);
            console.log(this.currentPatient);
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
    
</style>
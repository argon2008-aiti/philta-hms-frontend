<template>
    <div style="height: 40px; position: relative; margin-bottom: 20px;">
        <Avatar :style="avatarStyle()">{{report.patient.first_name[0]}}</Avatar>
        <div style="position: absolute; top: 0px; left: 50px;">
            {{report.patient.full_name }}
        </div>
        <div style="position: absolute; bottom: 0px; left: 50px;" class="patient-id">
            {{report.patient.phone_number }}
        </div>
        <div style="position: absolute; bottom: 0px; right: 10px;" class="patient-id">
            {{getTime(report.created_at)}}
        </div>
        <div style="position: absolute; top: 0px; right: 10px;" 
             class="patient-id"
             v-if="report.patient.insurance_policy.provider">
             <Badge color="blue"/>
        </div>
    </div>
</template>

<script>
import randomcolor from 'randomcolor';
    export default {
        name: 'MedicalReportItemToday',
        props: {
            report: {
                type: Object,
            },
        },
        data() {
            return {
            }
        },

        methods: {

            avatarStyle: function(color, font_size) {
                return {
                'background': randomcolor({ luminosity: 'dark' }),
                'font-size': font_size,
                'margin-top': '4px'
                }
            }, 

            getTime(dateString) {
                let date = new Date(dateString);
                return date.toLocaleTimeString(['en-us'],
                           {hour12: true, hour: '2-digit', minute: '2-digit'});
            }
        },
        
    }
</script>

<style scoped>

.patient-id {
    font-size: 12px;
    color: #777;
}
</style>
<template>
<transition name="queue">
<div>
    <Card class="queued-patient-card">
        <div tabindex="-1" @focusout="visible=false" style="outline: none;">
            <Icon type="md-more" 
                class="queue-patient-more" 
                @mouseenter.native="iconColor = '#555'"
                @mouseleave.native="iconColor = '#ababab'"
                @click="visible=true"
                :color="iconColor">
                </Icon>
            <p class="patient-name" slot="title">{{patient_data.patient.full_name}}</p>
            <div style="text-align: center">
                <span class="vitals-wrapper" style="margin-right: 10px;">
                       <Icon type="ios-heart-outline" color="#ff4c4c"></Icon>
                       <span class="vitals-text" style="margin-left: 5px;">{{patient_data.blood_pressure}}</span>
                </span>
                <span class="vitals-wrapper" style="margin-right: 10px;">
                       <Icon type="ios-pulse-outline" color="#0099e5"></Icon>
                       <span class="vitals-text" style="margin-left: 5px;">{{patient_data.heart_rate}}</span>
                </span>
                <span class="vitals-wrapper">
                       <Icon type="ios-color-wand-outline" color="#34bf49"></Icon>
                       <span class="vitals-text" style="margin-left: 5px;">{{patient_data.body_temperature}}</span>
                </span>
            </div>
        </div>
    </Card>
        <Dropdown trigger="custom" 
                    placement='bottom-end' 
                    :transfer="true"
                    :visible="visible"
                    style="margin-left: 200px; margin-bottom: 20px;"
                    @on-click="handleContextMenuClick($event)">
            <DropdownMenu slot="list">
                <DropdownItem name="consult">
                <span>
                    <Icon type="ios-glasses-outline" size='24' style="margin-right: 10px;"/>
                </span>
                <span style="font-size: 14px;">See Patient</span>
                </DropdownItem>

                <DropdownItem name="forward" :disabled="nextAvailable==false">
                <span>
                    <Icon type="ios-arrow-dropleft" size='24' style="margin-right: 10px;"/>
                </span>
                <span style="font-size: 14px;">Move Forward</span>
                </DropdownItem>

                <DropdownItem name="backward" :disabled="previousAvailable==false">
                <span>
                    <Icon type="ios-arrow-dropright" size='24' style="margin-right: 10px;"/>
                </span>
                <span style="font-size: 14px;">Move Back</span>
                </DropdownItem>

                <DropdownItem style="padding: 10px 20px;" name="remove">
                <span>
                    <Icon type="ios-remove-circle-outline" size='24'
                        style="margin-right: 10px; margin-left: -5px; margin-top: -5px;" />
                </span>
                <span style="font-size: 14px;">Remove</span>
                </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </transition>
</template>

<script>
export default {
    name: 'QueuedPatient',
    props: ['patient_data'],

    data() {
        return {
            iconColor: "#ababab",
            visible: false,
        }
    },
    computed: {
        patientIndex() {
            const index = this.$store.getters['queue/patientIndex'](this.patient_data._id);
            return index;
        },

        queueLength() {
            return this.$store.getters['queue/queueCount'];
        },

        nextAvailable() {
            return this.patientIndex > 0;
        },

        previousAvailable() {
            return this.patientIndex < this.queueLength - 1;
        },

    },

    methods: {
        handleContextMenuClick(name) {
            console.log(name);

            switch (name) {
                case 'consult':
                    this.$root.$emit('consultPatient', this.patient_data);
                    break;

                case 'forward':
                    this.$store.commit('queue/movePatientUp', this.patient_data._id);
                    break;

                case 'backward':
                    this.$store.commit('queue/movePatientDown', this.patient_data._id);
                    break;

                case 'remove':
                    //delete from queue and from database
                    this.$store.dispatch('queue/delete', this.patient_data._id);
                    break;
            
                default:
                    break;
            }
        }
    },


}
</script>

<style scoped>
    .queued-patient-card {
        margin-right: 10px;
    }

    .vitals-text {
        font-size: 11px;
    }

    .patient-name {
        text-align: center;
        letter-spacing: 0.5px;
    }

    .queue-patient-more {
        position: absolute;
        right: 10px;
        top: 20px;
        cursor: pointer;
    }

    .queue-enter-active, .queue-leave-active {
        transition: transform 0.3s;
    }

    .queue-enter, .queue-leave-to {
        transform: scale(0)
    }

    .queue-enter-to {
        transform: scale(1)
    }
</style>

<style>

</style>
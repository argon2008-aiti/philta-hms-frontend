<template>
    <Card :dis-hover="true">
        <div>
            {{ diagnostic_item.title }}
            <span style="float: right;">
                <Tooltip
                    content="Delete"
                    :delay="500"
                    placement="left-start"
                    theme="light">
                    <Icon type="ios-trash-outline" 
                          size="18"
                        @click="deleteReport"
                        @mouseenter.native="iconColor = '#555'"
                        @mouseleave.native="iconColor = '#ababab'"
                        style="cursor: pointer;"
                        :color="iconColor"/>
                </Tooltip>
            </span>
        </div>
        <Icon type="ios-document-outline"/>
        <span style="font-size: 12px; color:#9f9f9f">{{ diagnostic_item.file.name }}</span>
    </Card>
</template>

<script>
export default {
    name: 'DiagnosticItem',
    props: ['diagnostic_item'],

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
        deleteReport() {
            this.$root.$emit("deleteDiagnostic", this.diagnostic_item.index);
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
<template>
          <Modal v-model="modal_active"
                :title="title"
                :z-index=5000
                class-name="vertical-center-modal">
                <Form ref="providerForm" label-position="top" :rules="formValidationRules" :model="PolicyForm">
                    <FormItem label="Insurance Provider:" prop="provider">
                        <Select v-model="PolicyForm.provider" 
                            placeholder="Choose an insurance company"
                            @on-change="providerChanged">
                            <Option v-for="provider in providers" :key="provider._id" :value="provider._id">
                            {{provider.company_name}}
                            </Option>
                        </Select>
                    </FormItem>
                    <Row :gutter=12>
                        <Col span="12" v-if="modal_type">
                            <FormItem label="Policy Number:" prop="policy_number">
                                <Input v-model="PolicyForm.policy_number"
                                    placeholder="Provide policy number">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="12" v-if="!modal_type">
                            <FormItem label="Staff ID:" prop="policy_number">
                                <Input v-model="PolicyForm.policy_number"
                                    placeholder="Provide policy number">
                                </Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="Maximum Cover:" prop="maximum_cover">
                                <Input v-model="PolicyForm.maximum_cover"
                                    placeholder="Maximum insurance cover for patient">
                                </Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row :gutter=12 v-if="modal_type">
                        <Col span="12">
                            <FormItem label="Policy Activation Date:" prop="policy_start">
                                <DatePicker type="date" 
                                            placeholder="Policy start date"
                                            v-model="PolicyForm.policy_start"
                                            style="width: 100%;"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="Policy Expiration Date:" prop="policy_end">
                                <DatePicker type="date" 
                                            placeholder="date of birth is required"
                                            v-model="PolicyForm.policy_end"
                                            style="width: 100%;"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>

                <div slot="footer">
                    <Button type="text" 
                            size="large" 
                            @click="modal_active=false">
                            <span>Discard</span>
                    </Button>

                    <Button type="primary" 
                            size="large" 
                            @click="savePolicy">
                            <span>Save</span>
                    </Button>
                </div>
          </Modal>
</template>

<script>
    export default {
        name: 'NewInsurancePolicyModal',
        props: ['patient_id', 'title', 'insurance_data'],

        data() {
            return {
                modal_active: false,
                modal_type: false,
                providers: '',
                PolicyForm: {
                        provider: '',
                        policy_number: '',
                        maximum_cover: '',
                        policy_start: '',
                        policy_end: '',
                    },

                formValidationRules: {
                    provider: [
                        {required: true, message: "Select an Insurance Provider", trigger: 'blur'}
                    ],

                    policy_number: [
                        {required: true, message: "A policy number is required", trigger: 'blur'},
                    ],

                    maximum_cover: [
                        {required: true, message: "Provide maximum cover", trigger: 'change'}
                    ],

                    policy_start: [
                        {required: true, message: "Provide activation date", trigger: 'change'}
                    ],

                    policy_end: [
                        {required: true, message: "Provide expiration date", trigger: 'change'}
                    ],
                }
            }
        },

        methods: {
            savePolicy() {
                let payload = {};
                payload.id = this.patient_id;
                payload.insurance_policy = this.PolicyForm;

                this.$store.dispatch('patient/update', {
                    'patientData': payload
                }).then((data) => {
                    console.log(data);
                    this.$root.$emit("insurancePolicyAdded", data);
                    this.modal_active = false;
                }).catch((error) => {
                    console.log(error);
                });
            },

            providerChanged(provider) {
                let provider_data = this.providers.find(p=>p._id==provider);
                this.modal_type = provider_data.insurer_type=="Organization"? true : false;
            }

        },

        mounted() {
            this.modal_active = true;
            this.$store.dispatch('provider/fetch')
                .then((providers) => {
                    console.log(providers);
                    this.providers = providers
                }).catch((error) => {
                    console.log(error);
                });

            // prepopulate form if this is an edit
            if(this.insurance_data.policy_number) {
                this.PolicyForm.provider = this.insurance_data.provider._id;
                this.PolicyForm.policy_number = this.insurance_data.policy_number;
                this.PolicyForm.maximum_cover = this.insurance_data.maximum_cover;
                this.PolicyForm.policy_start = this.insurance_data.policy_start;
                this.PolicyForm.policy_end = this.insurance_data.policy_end;
            }
        }

    }
</script>

<style scoped>
    .avatar-container {
        background: white;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    .logo-hint {
        color: #bbb;
        text-align: center;
        cursor: pointer;
    }

</style>
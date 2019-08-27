<template>
          <Modal v-model="modal_active"
                class="add-patient-modal"
                :title="title"
                :z-index=5000
                class-name="vertical-center-modal">
                <Form ref="providerForm" label-position="top" :rules="formValidationRules" :model="ProviderForm">
                    <FormItem label="Company Name:" prop="company_name">
                        <Input v-model="ProviderForm.company_name"
                            placeholder="name of insurance company"
                            suffix="ios-podium-outline">
                        </Input>
                    </FormItem>
                    <FormItem label="Phone Number:" prop="phone_number">
                        <Input v-model="ProviderForm.phone_number" 
                            placeholder="phone number is required"
                            suffix="ios-call-outline">
                        </Input>
                    </FormItem>
                    <FormItem label="Email:" prop="email">
                        <Input v-model="ProviderForm.email" 
                            placeholder="optional"
                            suffix="ios-mail-outline">
                        </Input>
                    </FormItem>
                    <Row :gutter=12>
                        <Col span="16">
                        <FormItem label="Insurer Type:" prop="insurer_type">
                            <RadioGroup v-model="ProviderForm.insurer_type" 
                                        type="button">
                                <Radio label="Organization" >
                                    <span>Corporate Provider</span>
                                </Radio>
                                <Radio label="ThirdParty">
                                    <span>Third Party Provider</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="Provider Logo:" class="float-right">
                                <div class="avatar-container">
                                    <Icon type="ios-podium-outline" size="96" color="#ddd"/>
                                    <p class="logo-hint">click to add logo</p>
                                </div>
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
                            @click="saveProvider">
                            <span>Save</span>
                    </Button>
                </div>
          </Modal>
</template>

<script>
    export default {
        name: 'NewInsuranceProviderModal',
        props: ['title', 'providerData'],

        data() {
            return {
                modal_active: false,
                patient_to_edit: 2,
                ProviderForm: {
                        company_name: '',
                        insurer_type: '',
                        phone_number: '',
                        email: '',
                        logo_url: ''
                    },

                formValidationRules: {
                    company_name: [
                        {required: true, message: "Please enter insurance company's first name", trigger: 'blur'}
                    ],

                    phone_number: [
                        {required: true, message: "phone number cannot be empty", trigger: 'blur'},
                    ],

                    insurer_type: [
                        {required: true, message: "Type of insurer is required", trigger: 'change'}
                    ],

                    email: [
                        {required: true, message: "email address is required", trigger: 'blur'},
                    ]
                }
            }
        },

        methods: {
            saveProvider() {

                // save insurance provider to database
                this.$store.dispatch('provider/create', {
                    'providerData': this.ProviderForm
                }).then((data) => {
                    this.$root.$emit("newProviderSaveSuccess", data);
                    this.modal_active = false;
                }).catch((error) => {
                    this.$root.$emit("newProviderSaveError", 
                        "There was an error saving the insurance provider");
                });
            }
        },

        mounted() {
            this.modal_active = true;
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
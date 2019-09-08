<template>
          <Modal v-model="modal_active"
                class="add-patient-modal"
                :title="title"
                :z-index=5000
                class-name="vertical-center-modal">
                <Form ref="providerForm" label-position="top" :rules="formValidationRules" :model="ProviderForm">
                    <FormItem label="Company Name:" prop="company_name">
                        <Input v-model="ProviderForm.company_name"
                            placeholder="name of insurance company" type="text"
                            suffix="ios-podium-outline">
                        </Input>
                    </FormItem>
                    <FormItem label="Phone Number:" prop="phone_number">
                        <Input v-model="ProviderForm.phone_number" type="number"
                            placeholder="phone number is required"
                            suffix="ios-call-outline">
                        </Input>
                    </FormItem>
                    <FormItem label="Email:" prop="email">
                        <Input v-model="ProviderForm.email" type="email"
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
                            <FormItem label="Provider Logo:" class="float-right" ref="form_item">
                                <input type="file" ref="file_input" accept="image/*"/>
                                <!--<div class="avatar-container">
                                    <Icon type="ios-podium-outline" size="96" color="#ddd"/>
                                    <p class="logo-hint">click to add logo</p>
                                </div>-->
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
                        logo: ''
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

                    logo: [
                        {required: true, message: "A company logo is required", trigger: 'change'}
                    ],
                }
            }
        },

        methods: {
            saveProvider() {
                let form = new FormData();
                form.append('company_name', this.ProviderForm.company_name);
                form.append('phone_number', this.ProviderForm.phone_number);
                form.append('email', this.ProviderForm.email);
                form.append('insurer_type', this.ProviderForm.insurer_type);
                form.append('logo', this.$refs.file_input.files[0]);
                // save insurance provider to database
                this.$store.dispatch('provider/create', {
                    'providerData': form
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
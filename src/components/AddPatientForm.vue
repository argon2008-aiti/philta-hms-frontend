<template>
    <Form ref="addPatientForm" :model="addPatientForm" label-position="top" :rules="formValidationRules">
        <Row :gutter=8 type="flex" align="bottom">
            <Col span="18">
                <FormItem label="First Name" prop="first_name">
                    <Input v-model="addPatientForm.first_name"
                        placeholder="first name is required"
                        suffix="ios-person-outline">
                    </Input>
                </FormItem>
                <FormItem label="Other Names" prop="family_name">
                    <Input v-model="addPatientForm.family_name"
                        placeholder="last name is required"
                        suffix="ios-person-outline">
                    </Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem label="Profile Picture" class="float-right">
                    <div class="avatar-container">
                        <Icon type="ios-person-outline" size="96" color="#ddd"/>
                    </div>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter=16>
            <Col span="12">
                <FormItem label="Phone Number" prop="phone_number">
                    <Input v-model="addPatientForm.phone_number" 
                        placeholder="phone number is required"
                        suffix="ios-call-outline">
                    </Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="Email" prop="email">
                    <Input v-model="addPatientForm.email" 
                        placeholder="optional"
                        suffix="ios-mail-outline">
                    </Input>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter=12>
            <Col span=14>
                <FormItem label="Date of Birth" prop="date_of_birth">
                    <DatePicker type="date" 
                                placeholder="date of birth is required"
                                v-model="addPatientForm.date_of_birth"
                                :options="date_picker_options"
                                style="width: 100%;"></DatePicker>
                </FormItem>
            </Col>
            <Col span=10>
                <FormItem label="Gender" class="float-right" prop="gender">
                    <RadioGroup v-model="addPatientForm.gender" 
                                type="button">
                        <Radio label="Male" >
                            <span>Male</span>
                        </Radio>
                        <Radio label="Female">
                            <span>Female</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </Col>
        </Row>
        <Row :gutter=16>
            <Col span="12">
                <FormItem label="Occupation" prop="occupation">
                    <Input v-model="addPatientForm.occupation" 
                        placeholder="Occupation is required"
                        suffix="ios-briefcase-outline">
                    </Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="Company" prop="company">
                    <Input v-model="addPatientForm.company" 
                        placeholder="optional"
                        suffix="ios-podium-outline">
                    </Input>
                </FormItem>
            </Col>
        </Row>

        <FormItem label="Residential Address" prop="residential_address">
            <Input v-model="addPatientForm.residential_address" 
                   placeholder="address is required"
                   suffix="ios-home-outline">
            </Input>
        </FormItem>
    </Form>
</template>

<script>
export default {

    props: ['patient'],
    
    data() {
        return {
            addPatientForm: {
                    first_name: '',
                    family_name: '',
                    phone_number: '',
                    email: '',
                    occupation: '',
                    gender: '',
                    date_of_birth: '',
                    residential_address: ''
                },

            date_picker_options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                   }
                },

            formValidationRules: {
                first_name: [
                    {required: true, message: "Please enter patient's first name", trigger: 'blur'}
                ],

                family_name: [
                    {required: true, message: "Please enter patient's last name", trigger: 'blur'}
                ],

                phone_number: [
                    {required: true, message: "phone number cannot be empty", trigger: 'blur'},
                ],

                gender: [
                    {required: true, message: "Gender is required", trigger: 'change'}
                ],

                date_of_birth: [
                    {required: true, type: 'date', message: "Provide date of birth", trigger: 'blur'},
                ],

                occupation: [
                    {required: true, message: "Provide an occupation", trigger: 'blur'},
                ],

                residential_address: [
                    {required: true, message: "residential address is required", trigger: 'blur'},
                ]
            }
        }
    },

    methods: {
        clearFormFields() {
            this.$refs['addPatientForm'].resetFields();
        },

        resetFormData() {
            return {
                first_name: '',
                family_name: '',
                phone_number: '',
                email: '',
                occupation: '',
                gender: '',
                date_of_birth: '',
                residential_address: ''
            }
        },

        saveNewPatient() {
            // save patient by calling action in store
            let store_address = 'patient/create';
            if(this.patient !== -1 && this.addPatientForm.id) {
                store_address = 'patient/update'
            }
            this.$store.dispatch(store_address, {
                'patientData': this.addPatientForm
            }).then((data) => {
                this.$root.$emit("newPatientSaveSuccess", data);
                this.clearFormFields();
            }).catch((error) => {
                this.$root.$emit("newPatientSaveError", 
                     "There was an error saving the patient");
            });
        }
    },

    mounted() {
        if(this.patient !== -1 ) {
            let patient_to_edit = this.$store
                    .getters['patient/getPatientByID'](this.patient);
            if(patient_to_edit !== undefined){
                this.addPatientForm = JSON.parse(JSON.stringify(patient_to_edit));
            }
            if(patient_to_edit===undefined) {
                console.log("retrieving from server");
                this.$store.dispatch('patient/read', this.patient).then((result) => {
                    console.log(result);
                     this.addPatientForm = JSON.parse(JSON.stringify(result));
                }).catch((err) => {

                });
            }
        }
        // register for newPatientSaveRequest from parent Component
        this.$root.$on("newPatientSaveRequest", () => {
            this.$refs["addPatientForm"].validate(valid => {
                if(valid) {
                    // we start saving patient here
                    this.saveNewPatient();
                }
                else {
                    this.$root.$emit("newPatientSaveError", "The information you provided contains errors")
                }
            })
        });

        this.$root.$on("newPatientDiscardRequest", () => {
            this.clearFormFields();
        });


    },

    watch: {
        patient: function(newValue, oldValue) {
            console.log("patient has changed " + newValue);
            this.clearFormFields();
            if(newValue !== -1 ) {
               let patient_to_edit = this.$store
                        .getters['patient/getPatientByID'](newValue);
                this.addPatientForm = JSON.parse(JSON.stringify(patient_to_edit));
            }
            else {
                this.addPatientForm = this.resetFormData();
            }
        }
    }

}
</script>

<style scoped>
    .float-right {
        float: right;
    }

    .avatar-container {
        background: white;
        width: 100px;
        height: 100px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

</style>

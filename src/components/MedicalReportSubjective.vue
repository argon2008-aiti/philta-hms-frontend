<template>
    <div>
        <Form ref="medicalReportForm" :rules="formValidationRules">
                <Row :gutter="32">
                <Col span="8">
                    <!-- CC --------->
                    <FormItem prop="chief_complaint" label="Chief Complaint">
                        <Input type="text" 
                            v-model="subjectiveData.chief_complaint" 
                            placeholder="What brings you to the clinic today?">
                        </Input>
                    </FormItem>

                    <FormItem label="Condition Description" prop="condition_description">
                        <Input type="textarea" 
                            v-model="subjectiveData.condition_description" 
                            placeholder="Can you tell me more about the condition?">
                        </Input>
                    </FormItem>
                </Col>

                <Col span="8">
                    <!-- HPI --------->
                    <Divider orientation="right" size="small" class="form-group-divider">History of Present Illness (HPI)</Divider>

                    <FormItem prop="condition_onset" label="Condition Onset">
                        <Input type="text" 
                            v-model="subjectiveData.condition_onset" 
                            placeholder="When did the condition begin?">
                        </Input>
                    </FormItem>

                    <FormItem prop="condition_duration" label="Condition Duration">
                        <Input type="text" 
                            v-model="subjectiveData.condition_duration" 
                            placeholder="How long has the condition persisted?">
                        </Input>
                    </FormItem>

                    <FormItem prop="aggravating_factors" label="Aggravating Factors">
                        <Select 
                            filterable
                            multiple
                            remote
                            allow-create
                            @on-change="addToArray($event, 'aggravating_factors')"
                            :remote-method="doNothingMethod"
                            placeholder="What makes the condition worse?">
                        </Select>
                    </FormItem>

                    <FormItem prop="alleviating_factors" label="Alleviating Factors">
                        <Select  
                            filterable
                            multiple
                            remote
                            allow-create
                            @on-change="addToArray($event, 'alleviating_factors')"
                            :remote-method="doNothingMethod"
                            placeholder="What improves the condition?">
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                    <Divider orientation="right" size="small" class="form-group-divider">Medical History</Divider>
                    <FormItem prop="employment_activities" label="Employment/Social Activities">
                        <Select 
                            filterable
                            multiple
                            remote
                            allow-create
                            @on-change="addToArray($event, 'employment_activities')"
                            :remote-method="doNothingMethod"
                            placeholder="Driving, Reading, Working with machines">
                        </Select>
                    </FormItem>

                    <FormItem prop="chronic_diseases" label="Chronic/Long-term conditions">
                        <Select 
                            filterable
                            multiple
                            remote
                            allow-create
                            @on-change="addToArray($event, 'chronic_diseases')"
                            :remote-method="doNothingMethod"
                            placeholder="Any chronic conditions; diabetes, hypertension, asthma etc..">
                        </Select>
                    </FormItem>

                    <FormItem prop="current_medications" label="Current Medications">
                        <Select 
                            filterable
                            multiple
                            remote
                            allow-create
                            @on-change="addToArray($event, 'current_medications')"
                            :remote-method="doNothingMethod"
                            placeholder="Are you currently on any medications?">
                        </Select>
                    </FormItem>

                    <FormItem prop="surgical_history" label="Ocular Surgical History (Operation - year)">
                        <Select 
                            filterable
                            multiple
                            remote
                            allow-create
                            @on-change="addToArray($event, 'surgical_history')"
                            :remote-method="doNothingMethod"
                            placeholder="Have you had any eye surgery before?">
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
    export default {
        name: 'MedicalReportSubjective',
        props: [''],

        data() {
            return {
                subjectiveData: {
                    chief_complaint: '',
                    condition_description: '',
                    condition_onset: '',
                    condition_duration: '',

                    // Subjective data
                    aggravating_factors: [],
                    alleviating_factors: [],

                    //medical history
                    employment_activities: [],
                    chronic_diseases: [],
                    current_medications: [],
                    surgical_history: [],
                }
            }
        },

        computed: {
        },

        methods: {
            doNothingMethod: () => {
                // dummy method for select with remote filtereing
                return;
            },

            addToArray(items, array_name) {
                this.$store.commit('report/updateSubjectiveData', array_name, items);
                this.subjectiveData[array_name] = items.slice();
                console.log(this.subjectiveData);
            }
        },
        
    }
</script>

<style lang="scss" scoped>

</style>
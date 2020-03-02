<template>
          <Modal v-model="modal_active"
                :closable="false"
                :mask-closable="false"
                width=90
                class-name="vertical-center-modal medical-report-modal">

                <div slot="header">
                    <Row>
                        <Col span="10">
                            <div class="patient-name-title">{{patient_data.patient.full_name}}</div>
                        </Col>
                        <Col span="10">
                            <div class="patient-age-insurance">
                                <span>
                                    <Icon type="ios-body-outline" size="18"
                                          style="margin-right: 2px;"></Icon>
                                    {{patient_data.patient.date_of_birth | getAge}}
                                </span>
                                <span style="margin-left: 20px;">
                                    <Icon type="ios-construct-outline" size="18"
                                          style="margin-right: 2px;"></Icon>
                                    {{patient_data.patient.occupation}}
                                </span>
                                <span style="margin-left: 20px;">
                                    <Icon type="ios-medkit-outline" size="18"
                                          color="insuranceColor"
                                          style="margin-right: 2px;"></Icon>
                                    {{insuranceStatus}}
                                </span>
                             </div>
                        </Col>
                        <Col span="4">
                            <div class="vitals-container">
                                <span class="vitals-wrapper" style="margin-right: 10px;">
                                    <Icon type="ios-heart-outline" size="16" color="#ff4c4c"></Icon>
                                    <span class="vitals-text" style="margin-left: 5px;">{{patient_data.blood_pressure}}</span>
                                </span>
                                <span class="vitals-wrapper" style="margin-right: 10px;">
                                    <Icon type="ios-pulse-outline" size="16" color="#0099e5"></Icon>
                                    <span class="vitals-text" style="margin-left: 5px;">{{patient_data.heart_rate}}</span>
                                </span>
                                <span class="vitals-wrapper">
                                    <Icon type="ios-color-wand-outline" size="16" color="#3bbf49"></Icon>
                                    <span class="vitals-text" style="margin-left: 5px;">{{patient_data.body_temperature}}</span>
                                </span>
                            </div>
                        </Col>
                    </Row>

                </div>

                <Tabs value="name1">
                    <TabPane label="Subjective" name="name1">
                    <Form ref="medicalReportForm">
                            <Row :gutter="32">
                            <Col span="8">
                                <!-- CC --------->
                                <FormItem prop="chief_complaint" label="Chief Complaint"
                                               @on-form-blur="textChanged($event, 'chief_complaint')">
                                    <Input type="text" 
                                        placeholder="What brings you to the clinic today?">
                                    </Input>
                                </FormItem>

                                <FormItem label="Condition Description" prop="condition_description"
                                               @on-form-blur="textChanged($event, 'condition_description')">
                                    <Input type="textarea" 
                                        placeholder="Can you tell me more about the condition?">
                                    </Input>
                                </FormItem>
                            </Col>

                            <Col span="8">
                                <!-- HPI --------->
                                <Divider orientation="center" size="small" class="form-group-divider">History of Present Illness (HPI)</Divider>

                                <FormItem prop="condition_onset" label="Condition Onset"
                                               @on-form-blur="textChanged($event, 'condition_onset')">
                                    <Input type="text" 
                                        placeholder="What do you think brought about the condition?">
                                    </Input>
                                </FormItem>

                                <FormItem prop="condition_duration" label="Condition Duration"
                                               @on-form-blur="textChanged($event, 'condition_duration')">
                                    <Input type="text" 
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
                                <Divider orientation="center" size="small" class="form-group-divider">Medical Profile</Divider>
                                <FormItem prop="chronic_diseases" label="Chronic / Long-term conditions">
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
                                <FormItem prop="employment_activities" label="Nature of Employment / Social Activities">
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

                            </Col>
                        </Row>
                    </Form>
                    </TabPane>
                    <TabPane label="Objective" name="name2">
                        <Row>
                            <Col span="20">
                                <Row :gutter="6" v-show="isTop">
                                    <Col span="12" class="scrollable-column">
                                        <Divider orientation="center" class="form-group-divider" size="small">Visual Acuity</Divider>
                                        <!-- CC --------->
                                        <div style="margin-left: 20px; margin-right: 20px;">
                                            <Checkbox v-model="medicalReportForm.snellen_test_unaided.tested"
                                                    style="margin-bottom: 5px;">
                                                Snellen Test Unaided
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'snellen_test_unaided', 'right_eye')"
                                                        :disabled="!medicalReportForm.snellen_test_unaided.tested"
                                                        placeholder="Right Eye"
                                                        class="input-class">
                                                        <span slot="prepend">RE</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'snellen_test_unaided', 'left_eye')"
                                                        :disabled="!medicalReportForm.snellen_test_unaided.tested"
                                                        placeholder="Left Eye"
                                                        class="input-class">
                                                        <span slot="prepend">LE</span>
                                                    </Input>
                                                </Col>
                                            </Row>

                                            <Checkbox v-model="medicalReportForm.snellen_test_aided.tested" 
                                                    style="margin-bottom: 5px;">
                                                Snellen Test Aided (with correction)
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'snellen_test_aided', 'right_eye')"
                                                        :disabled="!medicalReportForm.snellen_test_aided.tested"
                                                        class="input-class"
                                                        placeholder="Right Eye">
                                                        <span slot="prepend">RE</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'snellen_test_aided', 'left_eye')"
                                                        :disabled="!medicalReportForm.snellen_test_aided.tested"
                                                        class="input-class"
                                                        placeholder="Left Eye">
                                                        <span slot="prepend">LE</span>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Checkbox v-model="medicalReportForm.counting_finger.tested" style="margin-bottom: 5px;">
                                                Counting Fingers  (CF)
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'counting_finger', 'right_eye')"
                                                        :disabled="!medicalReportForm.counting_finger.tested"
                                                        class="input-class"
                                                        placeholder="Right Eye">
                                                        <span slot="prepend">RE</span>
                                                        <Option value="0">CF-1</Option>
                                                        <Option value="1">CF-2</Option>
                                                        <Option value="2">CF-3</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'counting_finger', 'left_eye')"
                                                        :disabled="!medicalReportForm.counting_finger.tested"
                                                        class="input-class"
                                                        placeholder="Left Eye">
                                                        <span slot="prepend">LE</span>
                                                        <Option value="0">CF-1</Option>
                                                        <Option value="1">CF-2</Option>
                                                        <Option value="2">CF-3</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                            <Checkbox v-model="medicalReportForm.hand_motion.tested" style="margin-bottom: 5px;">
                                                Hand Motion  (HM at 1m)
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'hand_motion', 'right_eye')"
                                                        :disabled="!medicalReportForm.hand_motion.tested"
                                                        class="input-class"
                                                        placeholder="Right Eye">
                                                        <span slot="prepend">RE</span>
                                                        <Option value="poor">HM -</Option>
                                                        <Option value="good">HM +</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'hand_motion', 'left_eye')"
                                                        :disabled="!medicalReportForm.hand_motion.tested"
                                                        class="input-class"
                                                        placeholder="Left Eye">
                                                        <span slot="prepend">LE</span>
                                                        <Option value="poor">HM -</Option>
                                                        <Option value="good">HM +</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                            <Checkbox v-model="medicalReportForm.light_perception.tested" style="margin-bottom: 5px;">
                                                Light Perception (LP at 1m)
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'light_perception', 'right_eye')"
                                                        :disabled="!medicalReportForm.light_perception.tested"
                                                        class="input-class"
                                                        placeholder="Right Eye">
                                                        <span slot="prepend">RE</span>
                                                        <Option value="poor">LP -</Option>
                                                        <Option value="good">LP +</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'light_perception', 'left_eye')"
                                                        :disabled="!medicalReportForm.light_perception.tested"
                                                        class="input-class"
                                                        placeholder="Left Eye">
                                                        <span slot="prepend">LE</span>

                                                        <Option value="poor">LP -</Option>
                                                        <Option value="good">LP +</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col span="12">
                                        <Divider orientation="center" class="form-group-divider" size="small">Refraction</Divider>
                                            <div style="margin-left: 20px; margin-right: 20px;">
                                            <Checkbox v-model="medicalReportForm.spherical_power.tested" style="margin-bottom: 5px;">Spherical Power (SPH)</Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'spherical_power', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.spherical_power.tested">
                                                        <span slot="prepend">RE</span>
                                                        <span slot="append">dpt</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'spherical_power', 'left_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.spherical_power.tested">
                                                        <span slot="prepend">LE</span>
                                                        <span slot="append">dpt</span>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Checkbox v-model="medicalReportForm.cylindrical_power.tested" style="margin-bottom: 5px;">Cylindrical Power (CYL)</Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'cylindrical_power', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.cylindrical_power.tested">
                                                        <span slot="prepend">RE</span>
                                                        <span slot="append">dpt</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'cylindrical_power', 'left_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.cylindrical_power.tested">
                                                        <span slot="prepend">LE</span>
                                                        <span slot="append">dpt</span>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Checkbox v-model="medicalReportForm.axes.tested" style="margin-bottom: 5px;">Axes / Meridian (X)</Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'axes', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.axes.tested">
                                                        <span slot="prepend">RE</span>
                                                        <span slot="append">&deg</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'axes', 'left_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.axes.tested">
                                                        <span slot="prepend">LE</span>
                                                        <span slot="append">&deg</span>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            <Checkbox v-model="medicalReportForm.presbyopia_power.tested" style="margin-bottom: 5px;">Add Power (Presbyopia)</Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'presbyopia_power', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.presbyopia_power.tested">
                                                        <span slot="prepend">RE</span>
                                                        <span slot="append">dpt</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" size="small" 
                                                        @input="ocularTextChanged($event, 'presbyopia_power', 'left_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.presbyopia_power.tested">
                                                        <span slot="prepend">LE</span>
                                                        <span slot="append">dpt</span>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            </div>
                                    </Col>
                                   
                                </Row>
                                <Row v-show="!isTop" gutter=16>
                                    <Col span="12" class="scrollable-column">
                                        <Divider orientation="center" class="form-group-divider" size="small">Pupillometry</Divider>

                                        <div style="margin-left: 20px; margin-right: 20px;">
                                            <Checkbox v-model="medicalReportForm.pupil_shape_accomodation.tested"
                                                      style="margin-bottom: 5px;">
                                                Shape and Accommodation
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" size="small"
                                                        @input="ocularTextChanged($event, 'pupil_shape_accomodation', 'right_eye')"
                                                        :disabled="!medicalReportForm.pupil_shape_accomodation.tested"
                                                        class="input-class"
                                                        placeholder="Round Accomodating">
                                                        <span slot="prepend">RE</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" size="small"
                                                        @input="ocularTextChanged($event, 'pupil_shape_accomodation', 'left_eye')"
                                                        :disabled="!medicalReportForm.pupil_shape_accomodation.tested"
                                                        class="input-class"
                                                        placeholder="Round Accomodating">
                                                        <span slot="prepend">LE</span>
                                                    </Input>
                                                </Col>
                                            </Row>

                                            <Checkbox v-model="medicalReportForm.pupil_diameter.dim.tested"
                                                      style="margin-bottom: 5px;">
                                                Diameter (dark conditions)
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" 
                                                        size="small"
                                                        @input="setPupilDiameter($event, 'dim', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.pupil_diameter.dim.tested">
                                                        <span slot="prepend">RE</span>
                                                        <span slot="append">mm</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" 
                                                        size="small"
                                                        @input="setPupilDiameter($event, 'dim', 'left_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.pupil_diameter.dim.tested">
                                                        <span slot="prepend">LE</span>
                                                        <span slot="append">mm</span>
                                                    </Input>
                                                </Col>
                                            </Row>

                                            <Checkbox v-model="medicalReportForm.pupil_diameter.light.tested"
                                                      style="margin-bottom: 5px;">
                                                Diameter (normal conditions)
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="text" 
                                                        size="small"
                                                        @input="setPupilDiameter($event, 'light', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.pupil_diameter.light.tested">
                                                        <span slot="prepend">RE</span>
                                                        <span slot="append">mm</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="text" 
                                                        size="small"
                                                        @input="setPupilDiameter($event, 'light', 'left_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.pupil_diameter.light.tested">
                                                        <span slot="prepend">LE</span>
                                                        <span slot="append">mm</span>
                                                    </Input>
                                                </Col>
                                            </Row>

                                            <Checkbox v-model="medicalReportForm.direct_reactivity.tested"
                                                      style="margin-bottom: 5px;">
                                                Direct Reactivity 
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'direct_reactivity', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.direct_reactivity.tested"
                                                        placeholder="Right Eye">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        :disabled="!medicalReportForm.direct_reactivity.tested"
                                                        @input="ocularTextChanged($event, 'direct_reactivity', 'left_eye')"
                                                        class="input-class"
                                                        placeholder="Left Eye">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                            <Checkbox v-model="medicalReportForm.consensual_reactivity.tested"
                                                      style="margin-bottom: 5px;">
                                                Consensual Reactivity
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'consensual_reactivity', 'right_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.consensual_reactivity.tested"
                                                        placeholder="Right Eye">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'consensual_reactivity', 'left_eye')"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.consensual_reactivity.tested"
                                                        placeholder="Left Eye">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                    <Col span="12">
                                        <Divider orientation="center" class="form-group-divider" size="small">Confrontational Visual Fields</Divider>
                                            <div style="margin-left: 30px; margin-right: 20px;">
                                            <Checkbox v-model="medicalReportForm.visual_fields_right.tested"
                                                      style="margin-bottom: 5px;">
                                                Right Visual Fields
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_right', 'q1')"
                                                        :disabled="!medicalReportForm.visual_fields_right.tested"
                                                        class="input-class"
                                                        placeholder="Q 1">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_right', 'q2')"
                                                        :disabled="!medicalReportForm.visual_fields_right.tested"
                                                        class="input-class"
                                                        placeholder="Q 2">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_right', 'q4')"
                                                        :disabled="!medicalReportForm.visual_fields_right.tested"
                                                        class="input-class"
                                                        placeholder="Q 4">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_right', 'q3')"
                                                        :disabled="!medicalReportForm.visual_fields_right.tested"
                                                        class="input-class"
                                                        placeholder="Q 3">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                            </Row>

                                            <Checkbox v-model="medicalReportForm.visual_fields_left.tested"
                                                      style="margin-bottom: 5px;">
                                                Left Visual Fields
                                            </Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_left', 'q1')"
                                                        :disabled="!medicalReportForm.visual_fields_left.tested"
                                                        class="input-class"
                                                        placeholder="Q 1">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_left', 'q2')"
                                                        :disabled="!medicalReportForm.visual_fields_left.tested"
                                                        class="input-class"
                                                        placeholder="Q 2">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_left', 'q4')"
                                                        :disabled="!medicalReportForm.visual_fields_left.tested"
                                                        class="input-class"
                                                        placeholder="Q 4">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="12">
                                                    <Select type="text" 
                                                        size="small"
                                                        @input="ocularTextChanged($event, 'visual_fields_left', 'q3')"
                                                        :disabled="!medicalReportForm.visual_fields_left.tested"
                                                        class="input-class"
                                                        placeholder="Q 3">
                                                        <Option value="poor">POOR</Option>
                                                        <Option value="good">GOOD</Option>
                                                    </Select>
                                                </Col>
                                            </Row>
                                        </div>


                                        <Divider orientation="center" size="small" class="form-group-divider">Tonometry</Divider>
                                            <div style="margin-left: 30px; margin-right: 20px;">
                                            <Checkbox v-model="medicalReportForm.intraocular_pressure.tested"
                                                      style="margin-bottom: 5px;">Intraocular Pressure (mmHg)</Checkbox>
                                            <Row gutter=12>
                                                <Col span="12">
                                                    <Input type="number" 
                                                        @input="ocularTextChanged($event, 'intraocular_pressure', 'right_eye')"
                                                        size="small"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.intraocular_pressure.tested">
                                                        <span slot="prepend">RE</span>
                                                    </Input>
                                                </Col>
                                                <Col span="12">
                                                    <Input type="number" 
                                                        @input="ocularTextChanged($event, 'intraocular_pressure', 'left_eye')"
                                                        size="small"
                                                        class="input-class"
                                                        :disabled="!medicalReportForm.intraocular_pressure.tested">
                                                        <span slot="prepend">LE</span>
                                                    </Input>
                                                </Col>
                                            </Row>
                                            </div>
                                    </Col> 
                                </Row>
                            </Col> 
                            <Col span="4">
                                <div id="pager-button-group">
                                    <div class="button-group-text" v-bind:class="{active: isTop}">
                                        <p>Visual Acuity</p>
                                        <p>Refraction</p>
                                    </div>

                                    <ButtonGroup vertical size="large">
                                        <Button icon="ios-arrow-up" 
                                                class="pager-button"
                                                v-bind:class="{active: isTop}"
                                                @click="isTop=true"></Button>
                                        <Button icon="ios-arrow-down" 
                                                class="pager-button"
                                                v-bind:class="{active: !isTop}"
                                                @click="isTop=false"></Button>
                                    </ButtonGroup> 
                                    <div class="button-group-text" v-bind:class="{active: !isTop}">
                                        <p>Pupillometry</p>
                                        <p>Visual Fields</p>
                                        <p>Tonometry</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="Assessment" name="name3">
                        <Form>
                            <Row gutter=12>
                                <Col span="16">
                                    <Divider orientation="center" class="form-group-divider" size="small">Physician's Assessment</Divider>
                                    <FormItem label="" style="margin-top: 10px;"
                                               @on-form-blur="textChanged($event, 'assessment')">
                                        <Input type="textarea"
                                               placeholder="Etiologies, Symptoms and Diagnosis"
                                               rows="15">
                                        
                                        </Input>
                                    </FormItem>
                                </Col>

                                <Col span="8" style="height: 50vh;">
                                    <Divider orientation="center" class="form-group-divider" size="small">Diagnostics Documents</Divider>
                                        <div 
                                            class="diagnostic-container"
                                            v-for="item in diagnostic_data" 
                                            :key="item.title">
                                            <DiagnosticFileItem :diagnostic_item="item">

                                            </DiagnosticFileItem>
                                        </div>
                                        <Button 
                                            type="dashed" 
                                            @click="diagnostics_modal_active=true"
                                            style="float: right; margin-top: 10px;">
                                            <Icon type="ios-add"/>
                                            Add Document
                                        </Button>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane label="Plan" name="name4">
                        <Form>
                            <Row gutter="12">
                                <Col span="16">
                                    <Divider orientation="center" class="form-group-divider" size="small">Physician's Plan</Divider>
                                    <FormItem label="" style="margin-top: 10px;"
                                               @on-form-blur="textChanged($event, 'plan')">
                                        <Input type="textarea"
                                               placeholder="Steps to be taken to address identified symptoms"
                                               rows="15">
                                        
                                        </Input>
                                    </FormItem>
                                </Col>

                                <Col span="8" style="height: 50vh;">
                                    <Divider orientation="center" class="form-group-divider" size="small">Medication/ Prescriptions</Divider>
                                        <FormItem label="" style="margin-top: 10px;"
                                               @on-form-blur="textChanged($event, 'prescription')">
                                            <Input type="textarea"
                                                placeholder="Drugs prescribed for patient"
                                                rows="7">
                                            </Input>
                                        </FormItem>

                                    <Divider orientation="center" class="form-group-divider" size="small">Review</Divider>
                                        <FormItem style="margin-top: 20px;"
                                               @on-form-blur="textChanged($event, 'review_date')">
                                            <DatePicker 
                                                type="date" 
                                                :options="options3" 
                                                style="width:100%"
                                                placement="top-start"
                                                placeholder="Schedule a date for review"> 
                                            </DatePicker>
                                        </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </TabPane>
                </Tabs>


                <div slot="footer">
                    <Button type="text" 
                            size="large" 
                            @click="modal_active=false">
                            <span>Discard</span>
                    </Button>

                    <Button type="primary" 
                            size="large" 
                            :loading="loading"
                            @click="savePatientReport()">
                            <span>Save Report</span>
                    </Button>
                </div>
                <Modal v-model="diagnostics_modal_active"
                       title="Add Document"
                       :z-index=5100>
                       <Row :gutter="12">
                           <Col span="19">
                                <Input 
                                    placeholder="Diagnostics report title"
                                    element-id="diagnostic_title"
                                    @input="setDiagnosticTitle">
                                </Input>
                            </Col>
                           <Col span="5">
                                <Upload 
                                    :before-upload="handleDiagnosticUpload">
                                    <Button long>Add File</Button>
                                </Upload>
                            </Col>
                        </Row>
                        <div v-if="diagnostic_file !== null">
                            <Icon type="ios-document-outline"/>
                            <span style="font-size: 12px; color: #9f9f9f">{{ diagnostic_file.name }}</span>
                        </div>
                        <div slot="footer">
                            <Button type="text" 
                                    @click="clearDiagnosticData">
                                    <span>Discard</span>
                            </Button>

                            <Button type="primary" 
                                    @click="diagnosticModalOnOk">
                                    <span>Upload</span>
                            </Button>
                        </div>
                </Modal>
          </Modal>
</template>

<script>
    import DiagnosticFileItem from '@/components/DiagnosticFileItem.vue';
    import moment from 'moment';
    export default {
        name: 'MedicalReportModal',
        props: ['patient_data'],
        components: {
            'DiagnosticFileItem': DiagnosticFileItem,
        },

        data() {
            return {
                loading: false,
                modal_active: true,
                diagnostics_modal_active: false,
                dummyModel: [],

                diagnostic_title: '',
                diagnostic_file: null,
                diagnostic_data: [],
                diag_index: 0,

                iconColor: "#ababab",
                isTop: true,


                medicalReportForm: {

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
                    
                    // snellen data
                    snellen_test_unaided: {},
                    snellen_test_aided: {},

                    // CF data
                    counting_finger: {},

                    // HM d{}a
                    hand_motion: {},

                    // LP data
                    light_perception: {},

                    // Refraction d{}a
                    spherical_power: {},
                    cylindrical_power: {},
                    axes: {},
                    presbyopia_power: {},

                    // Pupilometry data
                    pupil_shape_accomodation: {},
                    pupil_diameter: {
                        dim: {}, light: {}
                    },
                    direct_reactivity: {},
                    consensual_reactivity: {},

                    // visual fields data
                    visual_fields_right: {},
                    visual_fields_left: {},

                    // tonometry data
                    intraocular_pressure: {},

                    // doctors assessment
                    assessment: '',
                    plan: '',
                    prescription: '',
                    review_date: '',

                },

                options3: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },

    
            }
        },

        computed: {
            insuranceStatus() {
               let insurance_status = !this.patient_data.patient.insurance_policy.provider ? "None" : 
                                  this.expired(this.patient_data.patient.insurance_policy.policy_end) ? "Expired" : "Active";
               return insurance_status;
            },

            insuranceColor() {
                let color = "#333";
                color = this.insuranceStatus=="Expired" ? "#ff4c4c" : "#3bbf49";
                return color;
            }
        },

        methods: {
            doNothingMethod: () => {
                return;
            },

            addToArray: function(items, array_name) {
                this.medicalReportForm[array_name] = items.slice();
                console.log(this.medicalReportForm);
            },

            handleDiagnosticUpload(file) {
                this.diagnostic_file = file;
                return false;
            },

            clearDiagnosticData() {
                this.diagnostic_file = null;
                document.getElementById('diagnostic_title').value = '';
                this.diagnostics_modal_active = false;
            },

            diagnosticModalOnOk() {
                const now = new Date().getTime() / 1000;
                this.diagnostic_data.push({
                    'index': this.diag_index,
                    'title': this.diagnostic_title,
                    'path': Math.round(now) + 
                            this.diagnostic_file.name,
                    'file': this.diagnostic_file
                });
                this.diag_index++;
                this.clearDiagnosticData();
            },

            textChanged(event, input) {
                this.medicalReportForm[input] = event;
                console.log(this.medicalReportForm);
            },

            ocularTextChanged(event, label, input) {
                this.medicalReportForm[label][input] = event;
                console.log(this.medicalReportForm);
            },

            setPupilDiameter(event, condition, eye) {
                this.medicalReportForm
                    .pupil_diameter[condition][eye] = event;
                console.log(this.medicalReportForm);
            },

            setDiagnosticTitle(title) {
                this.diagnostic_title = title;
            },

            savePatientReport() {
                this.loading = true;
                //console.log(this.diagnostic_data);
                this.medicalReportForm.diagnostics = this.diagnostic_data;
                this.medicalReportForm.patient = this.patient_data.patient;
                this.medicalReportForm.body_temperature = this.patient_data.body_temperature;
                this.medicalReportForm.heart_rate = this.patient_data.heart_rate;
                this.medicalReportForm.blood_pressure = this.patient_data.blood_pressure;

                this.$store.dispatch('report/create', this.medicalReportForm)
                           .then((result) => {
                               let queue = this.$store.getters['queue/mapPatientIDtoQueue'](result.patient.id);
                               console.log(queue);
                               this.loading = false;
                               this.modal_active = false;
                               this.$store.dispatch('queue/delete', 
                                                 queue._id);
                               
                           }).catch((err) => {
                               console.log(err);
                               this.loading = false;
                           });
            },

            expired: function(date) {
                let today = moment();
                let expire_date = moment(date);
                return expire_date.diff(today, 'days') < 0;
            }
        },

        mounted() {
            console.log(this.patient_data);
            this.$root.$on('deleteDiagnostic', (index) => {
                console.log(index);
                let array_index = this.diagnostic_data.findIndex(item => item.index == index);
                console.log(array_index);
                this.diagnostic_data.splice(array_index, 1);
            })

        }

    }
</script>

<style scoped>
    .patient-name-title {
        font-size: 20px;
        letter-spacing: 1px;
    }

    .vitals-container {
        position: absolute;
        text-align: center;
        top: 3px;
        right: 40px;
    }

    .vitals-text {
        font-size: 14px;
    }

    .ivu-divider-horizontal.ivu-divider-small.ivu-divider-with-text-right {
        margin: 0px 0px;
    }

    .diagnostic-container {
        margin: 10px 5px 10px 5px;
    }

    .scrollable-column {
        overflow-y: scroll;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .scrollable-column::-webkit-scrollbar {
        display: none;
    }

    .input-class {
        /* width: 200px; */
        margin-bottom: 20px;
    }

    .medical-report-modal {
        max-height: 100px;
    }

    #pager-button-group {
        position: absolute;
        left: 30%;
        text-align: center;
        top: 100px;
    }

    .button-group-text {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .active {
        border-color: #4f8961;
        color: #4f8961;
    }

    .patient-age-insurance {
        margin-top: 5px;
    }

</style>

<style>
    .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #4f8961;       
    }
</style>
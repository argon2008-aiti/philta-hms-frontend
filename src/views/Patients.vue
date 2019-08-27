<template>
  <div class="page-container">
      <div class="page-header">
        <Row :gutter=16>
          <Col span="4">
              <span class="header-title">Patients</span>
              <span style="margin-left: 5px; text-align: center;">
                <Badge :count="patientCount" class-name="patient-count-badge"></Badge>
              </span>
          </Col>
          <Col span=8>
            <AutoComplete 
                  size="large" 
                  :v-model="current_search"
                  placeholder="Search Patients [Name or ID]" 
                  :disabled="patientCount==0"
                  @on-search="searchPatient"
                  @on-select="patientSelected"
                  :clearable="true"
                  icon="ios-search">

                  <Option v-for="option in patientOptions" :value="option.id" :key="option.full_name">
                      <Avatar :style="avatarStyle(option.avatarColor)">{{option.first_name[0]}}</Avatar>
                      <span>{{option.full_name}}</span>
                  </Option>
                  </AutoComplete>
          </Col>
          <Col span=8>
             <Tooltip content="Sort By..." placement="right">
              <span style="padding: 10px;">
                <span style="font-size: 14px; padding-right: 5px;">
                   <Icon type="ios-arrow-round-up" size="32" ></Icon>
                   <Icon 
                       type="ios-arrow-round-down" 
                       size="32" 
                       style="margin-left: -20px;"></Icon>
                </span>
                <Select size="large" 
                        :clearable="true"
                        @on-change="handleSortRequest"
                        @on-clear="clearSortRequest"
                        style="width:100px" 
                        :disabled="patientCount==0"
                        placeholder="None">
                    <Option  value="full_name" key="name">Full Name</Option>
                    <Option  value="id" key="id">Patient ID</Option>
                    <Option  value="email" key="email">Email </Option>
                </Select>
              </span>
              </Tooltip>
          </Col>
          <Col span=4>
            <Button type="primary" 
                    size="large" 
                    style="float: right;"
                    @click="openNewPatientDialog()">
               Add Patient
            </Button>
          </Col>
        </Row>
      </div>
        <Card dis-hover style="margin-top: 50px; min-height: 80vh;">
      <div class="page-contents">
          <Modal v-model="add_user_modal_active"
                class="add-patient-modal"
                :title="modal_title"
                :z-index=5000
                class-name="vertical-center-modal">
                <AddPatientForm :patient="patient_to_edit"></AddPatientForm>

                <div slot="footer">
                    <Button type="text" 
                            size="large" 
                            @click="add_user_modal_active=false">
                            <span>Discard</span>
                    </Button>

                    <Button type="primary" 
                            size="large" 
                            :loading="asyncSavingPatient"
                            @click="modalOnOk">
                            <span>Save</span>
                    </Button>
                </div>
          </Modal>
          <NoDataView v-if="patientCount==0"
                      style="text-align: center; 
                             vertical-align: middle;
                             margin-top: 60px">
          </NoDataView>
          <Table v-else :columns="column_names" 
                 :data="patientList"
                 style="margin-top: 20px; padding-bottom: 20px"
                 stripe
                 :loading="table_loading"
                 @on-row-click="row_clicked"
                 size="large">
                <template  slot-scope="{ row, index }" slot="full_name">
                    <Avatar :style="avatarStyle(row.avatarColor)">{{row.first_name[0]}}</Avatar>
                    <span >{{ row.full_name }}</span>
                </template>

                <template class="patient-table-action-column" 
                          slot-scope="{index}" 
                          slot="actions">
                    <div @click="dropdownIconClicked">
                    <Dropdown trigger="click" 
                              placement='left-start' 
                              :transfer="true"
                              @on-click="handleContextMenuClick($event, index)">
                          <Icon class="patient-table-more-icon" type="md-more" size='20'/>
                      <DropdownMenu slot="list">
                          <DropdownItem name="details">
                            <span>
                              <Icon type="ios-list" size='24' style="margin-right: 10px;"/>
                            </span>
                            <span style="font-size: 14px;">View Details</span>
                          </DropdownItem>
                          <DropdownItem name="edit">
                            <span>
                              <Icon type="ios-create-outline" size='24' style="margin-right: 10px;"/>
                            </span>
                            <span style="font-size: 14px;">Edit Information</span>
                          </DropdownItem>
                          <DropdownItem style="padding: 10px 20px;" name="delete">
                            <span>
                              <Icon type="ios-trash-outline" size='24'
                                    style="margin-right: 10px; margin-left: -5px; margin-top: -5px;" />
                            </span>
                            <span style="font-size: 14px;">Delete Patient</span>
                          </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    </div>
                </template>
          </Table>
        </div>
      </Card>
      <Modal v-if="patientCount>0" v-model="patient_overview"
             width="640"
             :closable="false"
             :footer-hide="true">
        <div slot="header" class="patient-info-header">
            <Avatar size="large" :style="avatarStyle(currentPatient.avatarColor, '20px')">{{currentPatient.first_name[0]}}</Avatar>
            <span style="font-size: 20px; height: 40px; vertical-align: middle">
                  {{currentPatient.full_name}} [ {{currentPatient.patient_id}} ]
            </span>
            <span id="patient-info-header-button-container">
              <Tooltip content="Patient Details" placement="top">
                <div @click="showPatientDetails(current_index)">
                    <Icon type="md-list" size="22"></Icon>
                </div>
              </Tooltip>
              <Tooltip content="Edit Patient" placement="top">
                <div @click="editPatient(current_index)">
                    <Icon type="md-create" size="22"></Icon>
                </div>
              </Tooltip>
              <Tooltip content="Delete Patient" placement="top">
                <div @click="deletePatient(current_index)">
                    <Icon type="md-trash" size="22"></Icon>
                </div>
              </Tooltip>
              <Tooltip content="Close" placement="top">
                <div style="width: 30px; height: 30px; margin-left: 20px; vertical-align: middle"
                     @click="patient_overview=false">
                 <Icon type="md-close" 
                       size="26"></Icon></div>
              </Tooltip>
            </span>
        </div>
        <div id="patient-info-container">
            <div><Icon type="ios-call-outline" size="24"></Icon>
                 <span class="patient-info-inline">{{currentPatient.phone_number}}</span>
            </div>
            <div><Icon type="ios-mail-outline" size="24"></Icon>
                 <span class="patient-info-inline">{{currentPatient.email}}</span>
            </div>
            <div><Icon type="ios-construct-outline" size="24"></Icon>
                 <span class="patient-info-inline">{{currentPatient.occupation}}</span>
            </div>
            <div><Icon type="ios-pin-outline" size="24"></Icon>
                 <span class="patient-info-inline">{{currentPatient.residential_address}}</span>
            </div>
        </div>
        <div slot="footer">
        </div>
    </Modal>
  </div>
</template>

<script>
import AddPatientForm from '@/components/AddPatientForm';
import NoDataView from '@/components/NoDataView';
import randomcolor from 'randomcolor';
import sortByKey from "../utils/sorter";
import { setTimeout } from 'timers';

export default {
      components: {
      AddPatientForm,
      NoDataView
    },

    data() {
      return {
        current_search: '',
        modal_title: "New Patient Form",
        add_user_modal_active: false,
        patient_overview: false,
        sort_key: "id",
        table_loading: false,
        patient_to_edit: -1,
        current_index: 0,   // begin with this so that we don't have null pointer errors
        patientOptions: [],
        /*current_patient: {
                row_index: '',
                avatarColor: '',
                first_name: '',
                family_name: '',
                phone_number: '',
                email: '',
                occupation: '',
                gender: '',
                date_of_birth: '',
                residential_address: ''
            },*/

        column_names: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },

          {
            title: 'Name',
            slot: 'full_name',
            minWidth: 120,
            ellipsis: true,
            sortable: true
          },

          {
            title: 'OPD ID',
            key: 'patient_id',
            ellipsis: true
          },

          {
            title: 'Phone',
            key: 'phone_number',
            ellipsis: true
          },

          {
            title: 'Email',
            key: 'email',
            ellipsis: true
          },

          /*
          {
            title: 'Occupation',
            key: 'occupation',
            ellipsis: true
          },

          {
            title: 'Company',
            key: 'company',
            ellipsis: true
          },*/
          {
            title: " ",
            slot: 'actions',
            width: 50
          },
        ]
      }
    },

    methods: {

      fetchPatients() {
        this.table_loading = true;
        this.$store.dispatch('patient/fetch', {
                               router: this.$router
                             });
        this.table_loading = false;
      },

      openNewPatientDialog() {
        this.modal_title = "Add New Patient"
        this.patient_to_edit = -1;
        this.add_user_modal_active = true;
      },

      modalOnOk() {
        this.$root.$emit("newPatientSaveRequest");
      }, 

      getRandomColor() {
        return randomcolor({luminosity: 'dark'})
      },

      avatarStyle: function(color, font_size) {
        return {
          'background': color,
          'font-size': font_size,
          'margin-right': '15px'
        }
      }, 

      handleSortRequest: function(value) {
        if(value) this.sort_key = value;
        console.log(value);
      },

      clearSortRequest: function() {
        console.log("clear");
        this.sort_key = "id";
      }, 

      showPatientDetails: function(index) {
        this.patient_overview = false;
        setTimeout(()=>{
            let patient_id = this.$store.getters['patient/getPatientByIndex'](index).id;
            this.$router.push('/patients/details/' + patient_id);
        }, 50);  // hack to prevent patients list scrollbar from disappearing after return from details page
      },

      editPatient: function(index) {
          console.log(index);
          this.modal_title="Edit Patient Form";
          this.patient_to_edit = this.$store.getters['patient/getPatientByIndex'](index).id;
          this.add_user_modal_active = true;
      },

      deletePatient: function(index) {
          console.log("delete request: " + index);
          this.$Modal.confirm({
                  title: this.$store.getters['patient/getPatientByIndex'](index).full_name,
                  content: '<p>Are you sure you want to delete this patient?</p>',
                  loading: true,
                  okText: "Yes",
                  cancelText: "No",
                  onOk: () => {
                      this.patient_overview = false;
                      this.$store.dispatch('patient/delete', index)
                              .then((deletedPatient) => {
                                this.$Message.info("Patient deleted successfully");
                                this.$Modal.remove();
                              }).catch((error) => {
                                console.log(error);
                                this.$Message.error("Unable to delete Patient");
                              })
                  }
              });
      },

      handleContextMenuClick: function(name, index) {
          if(name=="details") {
            this.showPatientDetails(index)
          }
          else if(name==="edit") {
            this.editPatient(index);
          }
          else if(name==='delete') {
            this.deletePatient(index);
          }
      },

      row_clicked: function(row, index) {
        this.patient_overview = true;
        this.current_index = index;
      },

      dropdownIconClicked: function() {
        console.log("dropdown")
        event.stopPropagation();
      },

      closeModal: function() {
        console.log("closing modal");
        this.patient_overview = false;
      },

      searchPatient: function(query) {
        console.log(query);
        this.patientOptions =  this.patientList.filter(patient => {
          return patient.full_name.toUpperCase().indexOf(query.toUpperCase()) !== -1;
        });
      },

      patientSelected: function(value, patient) {
        this.$router.push('/patients/details/' + value);
      }

    },

    computed: {
      patientCount: function() {
        return this.$store.getters['patient/patientCount'];
      },

      patientList: function() {
        return this.$store.getters['patient/all'](this.sort_key);
      },

      asyncSavingPatient: function() {
        return this.$store.getters['patient/asyncSavingPatient'];
      },

      currentPatient: function() {
        return this.$store.getters['patient/getPatientByIndex'](this.current_index);
      }

    },

    mounted() {
      this.fetchPatients();
      this.$root.$on("newPatientSaveSuccess", (data) => {
        this.add_user_modal_active = false;
        this.patient_to_edit = -1;
        this.$Message.success({
          top: 50,
          duration: 5,
          render: h => {
            return h('div', [
                  h('p', data.full_name + " has been saved successfully")
              ]);
          }
        })

      });
    },

    watch: {

    }

}
</script>

<style scoped>
    .page-container {
      background: #fcfcfc;
      padding: 40px 20px;
    }

    .page-header .header-title {
      font-size: 24px;
      letter-spacing: 2px;
      display: inline-block;
    }

    .page-contents {
      background: white;
      margin-top: 1px;
      padding: 10px;
    }

    .ivu-table-wrapper {
      border: none;
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

    .patient-table-more-icon {
      color: #9e9e9e;
    }

    .patient-table-more-icon:hover {
      color: #333;
    }

    #patient-info-header > *{
      display: inline-block;
    }

    .patient-info-inline {
      margin-left: 20px;
      font-size: 14px;
    }

    #patient-info-container {
      margin-left: 20px;
    }

    #patient-info-container > * {
      margin: 20px 0px;
    }

    #patient-info-container > *:first-child {
      margin-top: 5px;
    }

    #patient-info-container > *:last-child {
      margin-bottom: 5px;
    }

    #patient-info-header-button-container {
      margin-top: 10px;
      float: right;
    }

    #patient-info-header-button-container > * {
      margin-left: 15px;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.8);
      opacity: 0.55;
    }

    #patient-info-header-button-container > *:hover {
      opacity: 0.8;
    }


</style>

<style lang="less">

  .vertical-center-modal{
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;

          .ivu-modal {
              top: 0;
          }

      }

  .ivu-table {
    font-size: 14px;
       th {
         background-color: #fff;
         border-bottom: 1px solid #e8eaec;
         margin-bottom: 10px;
       }

       td {
         border-bottom: none;
       }

       &:after {
         width: 0px
       }

       &:before {
         height: 0px
       }

       tr:hover {
         cursor: pointer;
       }

      .ivu-table-body {
        margin-top: 10px;
      }

  }

  .ivu-table-row-hover {
    background: #fcfcfc;
  }

  .ivu-modal-close {
    
    .ivu-icon-ios-close {
       transition: all 0.2s ease-in-out;
       &:hover {
         transform: scale(1.08);
       }     
    }
  }

.ivu-modal-header-inner {
      font-size: 16px;
      font-weight: normal;
      letter-spacing: 1px;
}

.patient-count-badge {
  top: -2px;
  font-family: inherit;
}
</style>

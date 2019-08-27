<template>
    <div class="sidebar-container">
        <img src="../assets/sidebar_logo.png" alt="sidebar-logo">
        <Menu theme="light" :active-name="active_item" style="height: 100%; max-width: 240px;">
            <router-link to='/'>
                <MenuItem name="dashboard">
                    <Icon type='md-stats'/>
                    DASHBOARD
                </MenuItem>
            </router-link>

            <router-link to='/patients'>
                <MenuItem name="patients">
                    <Icon type='md-people'/>
                    PATIENTS
                </MenuItem>
            </router-link>

            <router-link to='/consultations'>
                <MenuItem name="consultations">
                    <Icon type='ios-glasses'/>
                    CONSULTATIONS
                </MenuItem>
            </router-link>

            <router-link to='/bills'>
                <MenuItem name="billings">
                <Icon type='md-list-box'/>
                    BILLINGS
                </MenuItem>
            </router-link>

            <router-link to='/health_insurance'>
                <MenuItem name="insurance">
                    <Icon type='md-medkit'/>
                     INSURANCE
                </MenuItem>
            </router-link>
            
            <div class="section-divider">

            </div>
            <div class="user-account-container">
                <div class="profile-image-container">
                    <Icon type="ios-person-outline" size=72 color="#ddd"></Icon>
                </div>
                <p class="account-name">{{currentUser.full_name}}</p>
                <p class="badge-span account-role" style="margin-top: 5px;">{{currentUser.role}}</p>
                <div class="account-button-group">
                    <Button @click="">
                        <Icon type="ios-cog-outline" size=20
                              style="margin-bottom: 3px"></Icon>
                        Profile
                    </Button>
                    <Button type="primary" @click="logOut" style="margin-left: 10px;">
                        <Icon type="ios-exit-outline" size=20
                              style="margin-bottom: 3px"></Icon>
                        Log Out
                    </Button>
                </div>
            </div>
        </Menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active_item: " ",
        }
    },

    created: function() {
        this.active_item = this.$router.currentRoute.name;
    },
    
    computed: {
        currentUser() {
            return this.$store.getters['user/currentUser'];
        }
    },

    methods: {
        logOut() {
          this.$Modal.confirm({
                  title: "Session About To End",
                  content: '<p>Are you sure you want to log out?</p>',
                  okText: "Yes",
                  cancelText: "No",
                  onOk: () => {
                    localStorage.removeItem("token");
                    this.$router.push({ name: 'login'});
                    window.location.reload();
                  }
              });
        }

    },

    watch: {
        $route(to, from) {
            this.active_item = to.name;
        }
    }
}
</script>

<style scoped>
    .sidebar-container {
        height: 100%;
        background: #fff;
        width: 240px;
    }
    .ivu-menu-vertical .ivu-menu-item {
        letter-spacing: 2px;
        font-size: 12px;
        padding: 14px 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 500;
    }

    .ivu-menu-vertical .ivu-menu-item > i{
        font-size: 20px;
    }
    .ivu-menu-light.ivu-menu-vertical 
    .ivu-menu-item-active:not(.ivu-menu-submenu)
    {
        background: #c7edce;
        font-weight: bold;
    }
    a {
        color: #4a4a4a;
    }

    .section-divider {
        height: 1px;
        background: #dcdee2;
        margin: 24px 20px;
        clear: both;
    }

    .user-account-container {
        height: 240px;
        text-align: center;
    }

    .profile-image-container {
        height: 80px;
        width: 80px;
        border-radius: 40px;
        margin: 24px auto;
        margin-bottom: 10px;
        clear: both;
        border: #dcdee2 1px solid;
    }

    .account-name {
        color: #555;
        font-size: 16px;
    }
    .account-role {
        color: #555;
        font-size: 12px;
        display: inline-block;
        padding-left: 8px;
        padding-right: 8px;
        padding-bottom: 5px;
    }

    .account-button-group {
        margin-top: 20px;
    }
</style>

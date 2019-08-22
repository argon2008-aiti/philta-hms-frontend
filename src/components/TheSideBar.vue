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
</style>

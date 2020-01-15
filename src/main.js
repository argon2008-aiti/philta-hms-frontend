import Vue from 'vue'
import App from './App.vue'

import ViewUi from 'view-design';
import './assets/custom_theme/index.less';
import locale from 'view-design/dist/locale/en-US';
import router from './router'

import NoSideBar from './layouts/NoSideBar';
import Default from './layouts/Default';
import store from './store/index'

Vue.config.productionTip = false

Vue.component('no-sidebar-layout', NoSideBar);
Vue.component('default-layout', Default);

Vue.use(ViewUi, { locale });

import moment from 'moment'

Vue.filter('formatDate', function(value) {
    if (value) {
        return moment(String(value)).format('Do MMMM, YYYY');
    }
});

Vue.filter('getAge', function(value) {
    if (value) {
        return moment().diff(String(value), 'years') + " Years";
    }
});

Vue.filter('daysUntilExpire', function(value) {
    if (value) {
        //return moment().diff(String(value), 'days');
        let today = moment();
        let expire_date = moment(value);
        return expire_date.diff(today, 'days');
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
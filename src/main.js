import Vue from 'vue'
import App from './App.vue'

import iView from 'iview';
import './assets/custom_theme/index.less';
import locale from 'iview/dist/locale/en-US';
import router from './router'

import NoSideBar from './layouts/NoSideBar';
import Default from './layouts/Default';
import store from './store/index'

Vue.config.productionTip = false

Vue.component('no-sidebar-layout', NoSideBar);
Vue.component('default-layout', Default);

Vue.use(iView, { locale });

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

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
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

Vue.use(iView, {locale});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

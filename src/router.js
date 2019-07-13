import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import Patients from './views/Patients'
import PatientDetails from './views/PatientDetails'
import HealthInsurance from './views/HealthInsurance'
import Consultations from './views/Consultations'
import Bills from './views/Bills'
import LogIn from './views/LogIn'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      meta: { display_name: 'Dashboard' },
      component: Dashboard
    },

    {
      path: '/patients',
      name: 'patients',
      meta: { display_name: 'Patients' },
      component: Patients
    },

    {
      path: '/patients/details/:id',
      name: 'patients',
      component: PatientDetails,
      props: true
    },

    {
      path: '/consultations',
      name: 'consultations',
      meta: { display_name: 'Consultations' },
      component: Consultations
    },

    {
      path: '/health_insurance',
      name: 'insurance',
      meta: { display_name: 'Health Insurance' },
      component: HealthInsurance
    },

    {
      path: '/bills',
      name: 'billings',
      meta: { display_name: 'Billings' },
      component: Bills
    },

    {
      path: '/login',
      name: 'login',
      meta: { layout: 'no-sidebar' },
      component: LogIn,
      props: true
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

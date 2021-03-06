import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import Patients from './views/Patients'
import PatientDetails from './views/PatientDetails'
import HealthInsurance from './views/HealthInsurance'
import Consultations from './views/Consultations'
import MedicalReportDetails from './views/MedicalReportDetails'
import Bills from './views/Bills'
import BillDetails from './views/BillDetails'
import LogIn from './views/LogIn'

Vue.use(Router)

let router = new Router({
    routes: [{
            path: '/',
            name: 'dashboard',
            meta: {
                display_name: 'Dashboard',
                name: 'dashboard',
                requiresAuth: true
            },
            component: Dashboard
        },

        {
            path: '/dashboard',
            name: 'dashboard',
            meta: {
                display_name: 'Dashboard',
                name: 'dashboard',
                requiresAuth: true
            },
            component: Dashboard
        },

        {
            path: '/patients',
            name: 'patients',
            meta: {
                display_name: 'Patients',
                name: 'patients',
                requiresAuth: true
            },
            component: Patients
        },

        {
            path: '/patients/details/:id',
            name: 'patients',
            meta: {
                display_name: 'Patients',
                name: 'patients',
                requiresAuth: true
            },
            component: PatientDetails,
            props: true
        },

        {
            path: '/consultations',
            name: 'consultations',
            meta: {
                display_name: 'Consultations',
                name: 'consultations',
                requiresAuth: true
            },
            component: Consultations,
            props: true
        },

        {
            path: '/consultations/report/details/',
            name: 'medical_report_details',
            meta: {
                display_name: 'Medical Report Details',
                name: 'consultations',
                requiresAuth: true
            },
            component: MedicalReportDetails,
            props: true
        },

        {
            path: '/health_insurance',
            name: 'insurance',
            meta: {
                display_name: 'Health Insurance',
                name: 'insurance',
                requiresAuth: true
            },
            component: HealthInsurance
        },

        {
            path: '/bills',
            name: 'billings',
            meta: {
                display_name: 'Billing',
                name: 'billings',
                requiresAuth: true
            },
            component: Bills
        },

        {
            path: '/bills/details',
            name: 'billings_details',
            meta: {
                display_name: 'Billing Details',
                name: 'billings',
                requiresAuth: true
            },
            component: BillDetails,
            props: true
        },

        {
            path: '/login',
            name: 'login',
            meta: {
                layout: 'no-sidebar',
                guest: true
            },
            component: LogIn,
            props: true
        },

        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import ( /* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (localStorage.getItem('token') == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            let user = JSON.parse(localStorage.getItem('currentUser'))
            if (to.matched.some(record => record.meta.is_admin)) {
                if (user.role == 'admin') {
                    next()
                } else {
                    next({ name: 'dashboard' })
                }
            } else {
                next()
            }
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (localStorage.getItem('token') == null) {
            next()
        } else {
            next({ name: 'dashboard' })
        }
    } else {
        next()
    }
});

export default router;
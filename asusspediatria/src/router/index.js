import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApoderadoView from '../views/apoderado/ApoderadoView'
import HijoView from '../views/hijo/HijoView'
import KardexVacunaView from '../views/hijo/KardexVacunaView'
import CitaView from '../views/cita/CitaView'
import LoginView from '../views/LoginView'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/apoderado',
    name: 'apoderado',
    component: ApoderadoView,
    meta: { requiresAuth: true, role: ['admin','secretaria','pediatra'] } 
  },
  {
    path: '/cita',
    name: 'cita',
    component: CitaView,
    meta: { requiresAuth: true, role: ['admin','secretaria'] } 
  },
  {
    path: '/hijo',
    name: 'hijo',
    component: HijoView,
    meta: { requiresAuth: true, role: ['admin','pediatra'] } 
  },
  {
    path: '/hijo/:id/vacunas',
    name: 'hijoVacunas',
    component: KardexVacunaView,
    meta: { requiresAuth: true, role: ['admin','pediatra'] } 
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const userRole = store.getters.rol;
    console.log('guard', userRole);
    if (to.meta.role.includes(userRole)) {
      next();
    } else {
      next('/login'); // Redirigir a la página de inicio si no tiene permisos
    }
  } else {
    next(); // Asegúrate de llamar a next()
  }
});

export default router

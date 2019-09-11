import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/register'
import Login from '@/components/login'
import authGuard from "../authguard";
import Home from '@/components/home';
import Contacts from '@/components/contacts';
import AddContact from '@/components/AddContact';
import Categories from '@/components/Categories';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      beforeEnter: authGuard,
      children: [
        {
          path: '/contacts',
          name: 'contacts',
          component: Contacts,
          beforeEnter: authGuard
        },
        {
          path: '/addcontact',
          name: 'addcontacts',
          component: AddContact,
          beforeEnter: authGuard
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories,
          beforeEnter: authGuard
        }
      ]
    }
  ],
  mode: 'history'
})

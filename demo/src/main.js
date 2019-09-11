// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import vuetify from './plugins/vuetify'
import Vuelidate from 'vuelidate'
import Toaster from 'v-toaster'

import 'v-toaster/dist/v-toaster.css'

Vue.config.productionTip = false

Vue.use(VueResource);
Vue.use(Vuelidate);
Vue.use(Toaster, {timeout: 2500})


Vue.filter('to-uppercase',function(value){
  return value.toUpperCase();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuetify,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
<<<<<<< HEAD
import store from "./store";

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
=======

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
>>>>>>> d56cb37167213a4b22166dd76cd5224a20bbd5f1
  components: { App },
  template: '<App/>'
})

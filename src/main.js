import Vue from 'vue'
import ElementUI from 'element-ui'
import router from './router'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import store from "./store";
import i18n from './i18n/i18n'

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

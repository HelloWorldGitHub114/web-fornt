import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router/router'
import store from './store'
import VueParticles from 'vue-particles'
import axios from 'axios';


Vue.config.productionTip = false

axios.defaults.baseURL = 'https://mock.apifox.com/m1/4257489-3899055-default';

Vue.use(VueParticles)
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

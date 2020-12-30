import Vue from 'vue';
import App from './App';
import store from './store'
import router from './router'
Vue.config.productionTip = false

import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  position: 'top-center',
  duration: 3000
})

Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

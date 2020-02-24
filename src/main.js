import Vue from 'vue'
import router from './router'
import store from './store'

import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')

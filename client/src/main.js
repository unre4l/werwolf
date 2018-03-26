/* eslint-disable */
import Vue from 'vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import VueNativeSock from 'vue-native-websocket'
import Vue2TouchEvents from 'vue2-touch-events'


// Vue.use(VueNativeSock, 'ws://localhost:40512', { format: 'json' })
Vue.use(VueNativeSock, 'wss://iamjonathan.de/werwolf/ws', { format: 'json' })
Vue.use(Vue2TouchEvents)

const unsync = sync(store, router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

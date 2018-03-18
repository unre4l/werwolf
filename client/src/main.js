/* eslint-disable */

import { sync } from 'vuex-router-sync'
import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Lobby from './components/Lobby.vue'
import Game from './components/Game.vue'
import VueNativeSock from 'vue-native-websocket'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueNativeSock, 'ws://localhost:9090', { store: store, format: 'json' })

const router = new VueRouter({
  routes: [
    { path: '/', component: Lobby },
    { path: '/lobby', component: Lobby },
    { path: '/game', component: Game }
  ]
})

const store = new Vuex.Store({
  state: {
    players: [],
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    }
  },
  mutations: {
    SOCKET_ONOPEN(state, event) {
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    SOCKET_ONMESSAGE(state, message) {
      state.message = message
    }
  }
})

const unsync = sync(store, router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

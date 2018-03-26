import Vue from 'vue'
import Router from 'vue-router'
import Lobby from '@/components/Lobby'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', component: Lobby },
        { path: '/lobby', component: Lobby },
        { path: '/game', component: Game }
    ]
})

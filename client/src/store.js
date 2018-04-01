/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        game: {
            players: [],
            id: '',
            minPlayerCount: 0,
            werewolfCount: 1,
            flow: 0
        },
        my: {
            id: '',
            name: '',
            location: {
                latitude: '',
                longitude: ''
            }
        },
        isConnected: false
    },
    mutations: {
        toggleReady(state){
            for (let i = 0; i < state.game.players.length; i++) {
                const player = state.game.players[i];
                if (player.id === state.my.id){
                    player.ready = player.ready ? false : true
                    state.game.players.splice(i, 1, player)
                    return
                }
            }
        },
        decreaseWerwolf(state) {
            state.game.werewolfCount = state.game.werewolfCount > 1 ? state.game.werewolfCount - 1 : state.game.werewolfCount
        },
        increaseWerwolf(state) {
            state.game.werewolfCount = state.game.werewolfCount + 1
        },
        setGameState(state, gameState) {
            // if (state.game.flow < gameState.flow){
            state.game = gameState
            // }
        },
        setMyName(state, name) {
            state.my.name = name
        },
        setMyLocation(state, location) {
            state.my.location = location
        },
        setMyId(state, id) {
            state.my.id = id
        },
        SOCKET_ONOPEN(state, event) {
            state.isConnected = true
        },
        SOCKET_ONCLOSE(state, event) {
            state.isConnected = false
        }
    },
    getters: {
        playerReadyCount: state => {
            return state.game.players.filter(player => player.ready).length
        },
        werewolfCount: state => {
            return state.game.werewolfCount
        },
        playerCount: state => {
            return state.game.players.length
        },
        myReadyState: state => {
            return state.game.players.find(player => player.id === state.my.id).ready
        },
        gameId: state => {
            return state.game.id
        },
        gameName: state => {
            return state.game.name
        },
        myLocation: state => {
            return state.my.location
        },
        myId: state => {
            return state.my.id
        },
        isConnected: state => {
            return state.isConnected
        },
        players: state => {
            return state.game.players
        },
        myName: state => {
            for (let i = 0; i < state.game.players.length; i++) {
                const player = state.game.players[i];
                if (player.id === state.my.id) {
                    return player.name
                }
            }
            return ''
        }
    }
})
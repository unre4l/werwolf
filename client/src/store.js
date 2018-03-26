/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        game: {
            players: [],
            id: ''
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
        setGameState(state, gameState) {
            state.game = gameState
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
        gameId: state => {
            return state.game.id
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
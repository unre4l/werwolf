const _ = require("lodash")
const geolib = require("geolib")

class Game {
    constructor (id, location) {
        this.id = id
        this.location = location
        this.players = []
        this.cycle = 'Night'
        this.cycleCount = 0
        this.radius = 150
    }

    getState(){
        let state = {
            id: this.id,
            location: this.location,
            players: [],
            cycle: this.cycle,
            cycleCount: this.cycleCount
        }

        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            state.players.push(player.getState())
        }

        return state
    }

    getId(){
        return this.id
    }

    activatePlayerByWs(ws){
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.hasSameWs(ws)) {
                player.deactivate()
                this.deliverState()
                return;
            }
        }
    }
    
    deactivatePlayerByWs(ws){
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.hasSameWs(ws)) {
                player.deactivate()
                this.deliverState()
                return;
            }
        }
    }

    getPlayer(id){
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.isSame(is)) {
                return player
            }
        }
        return null
    }

    getPlayer(id){
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.isSame(id)) {
                return player
            }
        }
        return null
    }

    isNearBy(location) {
        const distance = geolib.getDistance(location, this.location)
        return distance < this.radius
    }

    playerRename(playerId, name){
        const player = this.getPlayer(playerId)
        player.setName(name)
        this.deliverState()
    }

    deliverState(){
        const gameState = this.getState()
        this.players.forEach(p => {
            p.send({ type: 'gameState', gameState: gameState })
        })
    }

    addPlayer(player){
        this.players.push(player)
        const gameState = this.getState()
        this.players.forEach(p => {
            p.send({ type: 'gameState', gameState: gameState })
        })
    }
}

module.exports = Game
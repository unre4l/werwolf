const _ = require("lodash")
const geolib = require("geolib")
const axios = require('axios')
const config = require('./config.json')

class Game {
    constructor (id, location) {
        this.id = id
        this.location = location
        this.players = []
        this.flow = 0
        this.cycle = 'Night'
        this.cycleCount = 0
        this.radius = 150
        this.status = 'open'
        this.name = 'no name'
        this.minPlayerCount = 8
        this.werewolfCount = 1

        this.getPlaceName() 
    }

    async getPlaceName () {
        try{
            const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.location.latitude + ',' + this.location.longitude + '&key=' + config.googleapikey
            const r = await axios(url);
            const results = r.data.results
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if ('address_components' in result){
                    for (let i = 0; i < result['address_components'].length; i++) {
                        const c = result['address_components'][i];
                        if (c.types.includes('route')) {
                            this.name = c.short_name
                            this.deliverState()
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    setPlayerReady(playerId, ready){
        this.getPlayer(playerId).setReady(ready)
        this.deliverState()
    }

    setWerwolfCount(count){
        this.werewolfCount = count
    }

    getState(){
        let state = {
            id: this.id,
            location: this.location,
            players: [],
            cycle: this.cycle,
            cycleCount: this.cycleCount,
            status: this.status,
            name: this.name,
            minPlayerCount: this.minPlayerCount,
            werewolfCount: this.werewolfCount,
            flow: this.flow
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
    
    leaveOrDeactivatePlayerByWs(ws){
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i]
            if (player.hasSameWs(ws)) {
                if (this.status === 'open'){
                    player.leave()
                    this.players.splice(i, 1)
                    this.deliverState()
                }else{
                    player.deactivate()
                    this.deliverState()
                }
                return;
            }
        }
    }

    reconnectPlayer(playerId, ws) {
        const player = this.getPlayer(playerId)
        if (player) {
            player.setWebsocket(ws)
            player.activate()
            this.deliverState()
            return true
        }
        return false
    }

    isSame(id) {
        return this.id == id
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
        this.flow++
        const gameState = this.getState()
        this.players.forEach(p => {
            p.send({ type: 'gameState', gameState: gameState })
        })
    }

    addPlayer(player){
        console.log('addPlayer')
        console.log(this.players)
        this.players.push(player)
        const gameState = this.getState()
        console.log(gameState)
        this.players.forEach(p => {
            p.send({ type: 'gameState', gameState: gameState })
        })
    }
}

module.exports = Game
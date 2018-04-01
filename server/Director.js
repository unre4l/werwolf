const Player = require('./Player')
const Game = require('./Game')
const shortid = require('shortid');

class Director {
    constructor () {
        this.games = []
    }

    handle(msg, ws){
        msg = JSON.parse(msg)

        if(msg.type === 'hello'){
            this.hello(msg, ws)
        }
        if(msg.type === 'newPlayerName'){
            this.newPlayerName(msg, ws)
        }
        if(msg.type === 'ready'){
            this.ready(msg, ws)
        }
        if (msg.type === 'werwolfCount'){
            this.werwolfCount(msg, ws)
        }
    }

    leaveOrDeactivate(ws){
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i]
            if (game.leaveOrDeactivatePlayerByWs(ws)){
                return;
            }
        }
    }

    newPlayerName(msg, ws){
        const id = msg.playerId
        const name = msg.name

        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i]
            if (game.getPlayer(id)) {
                game.playerRename(id, name)
                return;
            }
        }
    }
    // new or reconnected player
    hello(msg, ws){
        const id = msg.playerId
        const name = msg.name
        const location = msg.location
        if (!this.reconnectPlayer(id, ws)) {
            const game = this.getGame(location)
            game.addPlayer(new Player(id, name, ws))
        }
    }
    
    ready(msg, ws){
        const playerId = msg.playerId
        const gameId = msg.gameId
        const ready = msg.ready

        const game = this.getGameById(gameId)
        game.setPlayerReady(playerId, ready)
        game.deliverState()
    }

    werwolfCount(msg, ws){
        const gameId = msg.gameId
        const count = msg.count
        const game = this.getGameById(gameId)
        game.setWerwolfCount(count)
        game.deliverState()
    }

    reconnectPlayer(playerId, ws) {
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i]
            const player = game.getPlayer(playerId)
            if (player) {
                player.setWebsocket(ws)
                player.activate()
                game.deliverState()
                return true
            }
        }
        return false     
    }

    getGameById(id) {
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i]
            if (game.isSame(id)) {
                return game;
            }
        }
    }

    getGame(location) {
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i]
            if (game.isNearBy(location)) {
                return game;
            }
        }

        const newGameId = shortid.generate()
        const game = new Game(newGameId, location)
        this.games.push(game)
        return this.games[this.games.length - 1]
    }
}

module.exports = Director
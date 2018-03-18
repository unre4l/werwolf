const _ = require("lodash");

export default class Game {
    constructor () {
        this.players = []
    }

    getPlayerNames(){
        return this.players.map(player => player.name);
    }

    join(player){
        this.players.forEach(player => {
            player.send('newPlayerName', player.name)
        })
        this.players.push(player)
        player.send('playerNames', 'playerNames', this.getPlayerNames())
    }
}
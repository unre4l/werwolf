const Util = require("./util");

export default class Player {
    constructor(ws, director) {
        this.ws = ws
        this.director = director
        this.name = Util.getRandomName()
        this.game = null

        this.ws.on('message', msg => {
            if(msg.type === 'ready'){
                const game = this.director.direct(msg.location)
                if(game.join(this)){
                    this.game = game
                }
            }
        })
    }

    send(type, data){
        this.ws.send(JSON.stringify({
            "msg": type,
            "data": data
        }))
    }
}
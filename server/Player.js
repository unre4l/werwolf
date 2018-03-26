const WebSocket = require('ws')
class Player {
    constructor(id, name, ws) {
        this.id = id
        this.name = name
        this.ws = ws
        this.role = 'none'
        this.alive = true
        this.active = true
        this.position = {
            x: null,
            y: null
        }
    }

    hasSameWs(ws){
        return this.ws == ws
    }

    deactivate(){
        this.active = false
    } 

    activate () {
        this.active = true
    }
    
    isSame(id){
        return this.id == id
    }

    setName(name){
        this.name = name
    }
    setWebsocket(ws){
        this.ws = ws
    }

    getState(){
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            active: this.active,
            alive: this.alive,
            position: this.position
        }
    }

    getWebsocket(){
        return this.ws
    }

    send(data){
        if (this.ws.readyState === WebSocket.OPEN){
            this.ws.send(JSON.stringify(data))
        }
    }
}

module.exports = Player
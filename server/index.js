const config = require('./config.json')
const Werwolf = require('./werwolf')
const Director = require('./Director')
const Player = require('./Player')
const http = require('http')
const express = require('express')
const Websocket = require('ws')

const app = express()
const server = http.createServer(app)
const wss = new Websocket.Server({ port: config.wsport })

const director = new Director()

wss.on('connection', ws => {
    ws.on('message', msg => {
        director.handle(msg, ws)
    })
    // new Player(ws, director)
})

server.listen(config.port)

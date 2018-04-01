const config = require('./config.json')
const Director = require('./Director')
const Player = require('./Player')
const http = require('http')
const express = require('express')
const Websocket = require('ws')
const crypto = require('crypto');
// token = crypto.randomBytes(64).toString('hex')

const app = express()
const server = http.createServer(app)
const wss = new Websocket.Server({ port: config.wsport })

const director = new Director()

wss.on('connection', ws => {
    console.log("connection (" + wss.clients.size + ")")
    ws.on('message', msg => director.handle(msg, ws))
    ws.on('close', () => director.leaveOrDeactivate(ws))
    ws.on('error', () => director.leaveOrDeactivate(ws))
})

console.log("running. " + config.port)
server.listen(config.port)

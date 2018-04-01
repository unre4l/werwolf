<template>
  <div id="app">
    <!-- <Feedback /> -->
    <div class="meta">
      <div>{{gameId}}</div>
      <div>{{gameName}}</div>
      <div>  {{playerCount}}/{{playerReadyCount}} <span class="playerleft">{{playerLeft}}</span></div>
      <div>{{myId}}</div>
    </div>


    <div class="werwolf-setting">
      <table class="">
        <tr>
          <td class="werwolf-setting-decrease" @click="decreaseWerwolf">-</td>
          <td>{{readableWerwolfCount}}</td>
          <td class="werwolf-setting-increase" @click="increaseWerwolf">+</td>
        </tr>
      </table>
    </div>

      
      

    <div class="player-lobby">
      <Player v-for="player in players" :name="player.name" :position="player.position" :active="player.active" :ready="player.ready" :role="player.role" :alive="player.alive" :playerId="player.id" :key="player.playerId" />
    </div>

    <div class="ready-action" @click="toggleReady">
      <span>ready</span>
    </div>

    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
/* eslint-disable */
import Cookies from 'js-cookie';
import shortid from 'shortid'
import Player from '@/components/Player'
// import Feedback from '@/components/Feedback'
import { mapMutations, mapGetters } from 'vuex';
import names from './names.js'

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    return out;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

export default {
  name: 'app',
  components: {
    'Player': Player,
    // 'Feedback': Feedback
  },
  data(){
    return {
      saidHello: false,
      tmpName: names[Math.floor(Math.random() * names.length)]
    }
  },
  mounted(){
    this.setMyLocation()
    this.setMyId()
    this.setMyNameRandom()

    this.$options.sockets.onopen = () => {
      this.$store.commit('SOCKET_ONOPEN')
      this.sayHello()
    }
    this.$options.sockets.onclose = () => this.$store.commit('SOCKET_ONCLOSE')

    this.$options.sockets.onmessage = msg => {
      msg = JSON.parse(msg.data)
      console.log(msg)
      switch(msg.type){
        case 'gameState':
          this.setGameState(msg.gameState)
        break;
      }
    }
  },
  computed: {
		...mapGetters ([
      'isConnected',
			'myLocation',
      'myId',
      'myName',
      'players',
      'gameId',
      'gameName',
      'playerCount',
      'werewolfCount',
      'playerReadyCount',
      'myReadyState'
    ]),
    playerLeft(){
      return this.playerCount < 8 ? '+' + (8-this.playerCount) : ''
    },
    readableWerwolfCount(){
      let s = 'x '
      if(this.werewolfCount === 1){
        s += 'Werwolf'
      }else{
        s += 'Werwölfe'
      }
      return this.werewolfCount + s 
    },
    name () {
      return this.myName ? this.myName : this.tmpName
    }
	},
  methods: {
    ...mapMutations([
      'setGameState',
      'setMyName'
    ]),
    closeTab(){
      console.log("close")
      window.close()
    },
    increaseWerwolf(){
      this.$store.commit('increaseWerwolf');
      this.$socket.sendObj({type: 'werwolfCount', gameId: this.gameId, count: this.werewolfCount })
    },

    decreaseWerwolf(){
      if(this.werewolfCount > 1){
        this.$store.commit('decreaseWerwolf');
        this.$socket.sendObj({type: 'werwolfCount', gameId: this.gameId, count: this.werewolfCount })
      }
    },
    toggleReady(){
      this.$store.commit('toggleReady');
      this.$socket.sendObj({type: 'ready', playerId: this.myId, gameId: this.gameId, ready: this.myReadyState })
    },

    setMyId(){
      if(!Cookies.get('werwolf-playerId') || Cookies.get('werwolf-playerId').length > 20){
        Cookies.set('werwolf-playerId', shortid.generate());
      }
      this.$store.commit('setMyId', Cookies.get('werwolf-playerId'));
    },

    setMyLocation(){
      if(!navigator.geolocation)
        return

      navigator.geolocation.getCurrentPosition(pos => {
        this.$store.commit('setMyLocation', {latitude: pos.coords.latitude, longitude: pos.coords.longitude})
        this.sayHello()
      })
    },

    validLocation(){
        return isFloat(this.myLocation.latitude) && isFloat(this.myLocation.longitude)
    },

    setMyNameRandom () {
      const name = names[Math.floor(Math.random() * names.length)]
      this.$store.commit('setMyName', name);
    },

    sayHello(){
      if(!this.saidHello && this.isConnected && this.validLocation()){
        this.saidHello = true
        this.$socket.sendObj({type: 'hello', location: this.myLocation, playerId: this.myId, name: this.name })
      }
    }

  }
}
</script>

<style lang="sass">
@import ../node_modules/bulma/sass/utilities/all

body
  margin: 0
  border: 0
  font-family: 'Open Sans', sans-serif


#app
  +desktop
    max-width: 480px
    margin: 40px auto
    height: 720px
    background: white
    box-shadow: 0 0 35px rgba(black, .2)
    position: relative

  .playerleft
    font-weight: 600
    color: red
  .player-lobby
    display: flex
    flex-wrap: wrap
    flex-direction: row
    justify-content: center

  .meta
    display: flex
    font-size: .6em
    margin: .7em
    color: #333
    font-weight: 300

    div
      flex: 1 
      text-align: center
      &:first-child
        text-align: left
      &:last-child
        text-align: right
  
  .werwolf-setting
    background: url('assets/blood.png') no-repeat
    background-size: 100% 100%
    height: 4.2em
    color: white
    font-weight: 600
    font-size: 1.2em

    table
      position: relative
      top: 1em
      width: 100%

      td
        text-align: center
        padding: 0 1em

  .ready-action
    position: absolute
    bottom: 0
    width: 100%
    left: 0
    padding: 2em 0
    text-align: center
    text-transform: uppercase
    font-weight: 700

  .lobby-name
      text-align: center
      font-weight: 600

  h1.title
      margin: 0
      padding: 0
      font-size: 1rem

  .role-table
    .role-action
      font-size: 1em
      text-align: center
      line-height: 1

.game-lobby
  &-title

    table
      border-collapse: collapse
      width: 100%
      border-top: 1px solid #ccc
      border-bottom: 1px solid #ccc

      tr
        &+tr
          td
            border-top: 1px solid #ccc

      td
        padding: .25em
        font-size: .5em

        &+td
          border-left: 1px solid #ccc

    table + table
      border-top: none

    .meta-table
      td:nth-child(even)
        text-align: center
        font-weight: 600
      td:nth-child(odd)
        font-weight: 300
        text-align: left
    
  &-player

  &-container
    background: red
    height: 70%
    width: 100%
</style>

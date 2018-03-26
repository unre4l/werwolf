<template>
  <div id="app">
    <div class="game-lobby-title">
      game: {{gameId}} - name: {{name}} - id: {{myId}}
    </div>

    <Player v-for="player in players" :name="player.name" :position="player.position" :active="player.active" :role="player.role" :alive="player.alive" :playerId="player.id" :key="player.playerId" />

    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
/* eslint-disable */
import Cookies from 'js-cookie';
import shortid from 'shortid'
import Player from '@/components/Player'
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
    'Player': Player
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
      'gameId'
    ]),
    name () {
      return this.myName ? this.myName : this.tmpName
    }
	},
  methods: {
    ...mapMutations([
      'setGameState',
      'setMyName'
    ]),

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
  background: #f4f4f4

#app
  h1.title
      margin: 0
      padding: 0
      font-size: 1rem

.game-lobby
  &-title
    text-align: center
    
  &-player

  &-container
    background: red
    height: 70%
    width: 100%
</style>

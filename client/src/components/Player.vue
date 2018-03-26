<template>
  <div class="player" :class="{active: active}">
        <div class="player-name-container" >
            <div class="player-name" :class="{me: isThisMe, edit: editMode}" @dblclick="enterEditMode" v-touch:longtap="enterEditMode">
                <div class="form" @keyup.enter="changeName">
                    <input v-model="editedName" :placeholder="name" @focusout="changeName" ref="editmask">
                </div>
                <span>{{name}}</span>
            </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Player',
    props: ['name', 'alive', 'position', 'role', 'playerId', 'active'],
    data(){
        return {
            isThisMe: false,
            editedName: '',
            editMode: false
        }
    },
    computed: {
        myId () {
            return this.$store.state.my.id
        }
	},
    mounted(){
        if(this.playerId === this.myId){
            this.isThisMe = true
        }
    },
    methods: {
        enterEditMode(){
            if(!this.isThisMe)
                return;

            this.editMode = true
            this.$refs.editmask.focus()
        },
        changeName(){
            this.editMode = false
            this.$store.commit('setMyName', this.editedName);
            this.$socket.sendObj({type: 'newPlayerName', playerId: this.myId, name: this.editedName })
            this.$refs.editmask.blur()
        }
    }
}
</script>

<style lang="sass" scoped>
.player
    position: relative
    border-radius: 50%
    height: 5em
    width: 5em
    background: url('../assets/bauer.png')
    background-size: cover
    margin: 1em
    display: inline-block
    line-height: 1
    opacity: .4

    &.active
        opacity: 1
    
    .me
        background: #687a6c
        color: white

    .form
        overflow: hidden
        height: 0 
        width: 0
        margin: 0
        padding: 0
        position: relative
        z-index: 0

    .edit
        background: #b5be7f
        color: black

        span
            display: none
        
        .form
            height: auto
            width: auto
            z-index: 1

    &-name
        display: inline-block
        padding: .3em
        background: white
        white-space: nowrap
        line-height: 1
        font-size: .9em
        border-radius: .75em
        box-shadow: 3px 3px 6px rgba(black, .2)  
        user-select: none
        cursor: pointer

        input
            width: 8em
            border: none
            background: none
            outline: none

        &-container
            position: absolute
            top: 0
            left: 50%
            text-align: center
            transform: translate(-50%, -70%)

</style>

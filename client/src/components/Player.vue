<template>
    <div class="player" :class="{active: active, ready: ready}">
        <div class="player-name" :class="{me: isThisMe, edit: editMode, error: invalidName}" @dblclick="enterEditMode" v-touch:longtap="enterEditMode">
            <div class="form" @keyup.enter="changeName">
                <input v-model="editedName" :placeholder="name" @focusout="changeName" ref="editmask">
            </div>
            <span>{{name}}</span>
        </div>

        <div class="player-avatar"></div>
    </div>
</template>

<script>
export default {
    name: 'Player',
    props: ['name', 'alive', 'position', 'role', 'playerId', 'active', 'ready'],
    data(){
        return {
            isThisMe: false,
            editedName: '',
            editMode: false,
            invalidName: false
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
            if(this.editedName.length > 0 && this.editedName.length < 3){
                this.invalidName = true
                return
            }
            this.invalidName = false
            this.editMode = false
            if(this.editedName.length > 0){
                this.$store.commit('setMyName', this.editedName);
                this.$socket.sendObj({type: 'newPlayerName', playerId: this.myId, name: this.editedName })
            }
            this.$refs.editmask.blur()
        }
    }
}
</script>

<style lang="sass" scoped>
.player
    position: relative
    text-align: center
    flex: 0 1 auto
    margin: 1em
    opacity: .4

    &.active
        opacity: 1

    &.ready
        .player-avatar
            &::after
                content: ''
                background: green
                opacity: .5
                position: absolute
                top: 0
                height: 100%
                left: 0
                width: 100%
                border-radius: 50%
                z-index: 2

    &-avatar
        border-radius: 50%
        height: 5em
        width: 5em
        background: url('../assets/bauer.png')
        background-size: cover
        display: block
        line-height: 1
        margin: 0 auto
        position: relative
        
    &-name
        display: inline-block
        padding: .3em
        white-space: nowrap
        line-height: 1
        font-size: .9em
        border-radius: .75em
        box-shadow: 3px 3px 6px rgba(black, .2)  
        user-select: none
        cursor: pointer
        position: relative

        &.me
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

        &.edit
            background: #b5be7f
            color: black

            span
                display: none
                line-height: 1
            
            .form
                height: auto
                width: auto
                display: block
                z-index: 1
                padding: 0
                margin: 0

    &.error
        background: red
        color: black

    &-name

        input
            width: 6em
            border: none
            background: none
            outline: none
            padding: 0
            margin: 0
            line-height: 1
            font-size: .9em

        &-container
            position: absolute
            z-index: 4
            top: 0
            left: 50%
            text-align: center
            transform: translate(-50%, -70%)

</style>

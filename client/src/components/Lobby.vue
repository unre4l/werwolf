<template>
  <div class="lobby">
    <h1>lobby</h1>
  </div>
</template>

<script>
export default {
  name: 'Lobby',
  computed: {
    count () {
      return store.state.count
    }
  }
}
</script>

<style lang="sass" scoped>

</style>

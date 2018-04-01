<template>
  <div class="feedback">
    <span>Feedback</span> 
  </div>
</template>

<script>
export default {
  name: 'Feedback'
}
</script>

<style lang="sass" scoped>
.feedback
    position: absolute
    top: -4em
    right: -4em
    width: 8rem
    height: 8rem
    background: #F89437
    transform: rotate(45deg)

    span
        position: absolute
        bottom: .2em
        text-transform: uppercase
        left: 50%
        color: white
        font-weight: 699
        transform: translate(-50%, 0)
</style>

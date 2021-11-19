<template>
  <div
    class="scroll-top"
    @click.prevent="scrollTop"
  >
    <div class="arrow" />
    <div class="bg" />
    <span>Scroll to Top</span>
  </div>
</template>

<script>

export default {
  name: 'ScrollTop',
  data() {
    return {}
  },
  methods: {
    scrollTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '../assets/scss/scrollTop.scss';
</style>

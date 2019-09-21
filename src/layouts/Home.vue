<template>
  <div class="main">
    <div class="gaming-area-container">
      <game-area></game-area>
    </div>
    <k-footer></k-footer>
  </div>
</template>

<script>
import KFooter from '@/components/KFooter.vue'
import GameArea from '@/components/GameArea.vue'

export default {
  name: 'Home',
  components: { KFooter, GameArea }
}
</script>

<style lang="less" scoped>
  .main {
    display: flex;
    height: 100%;
    flex-direction: column;
  }
  .gaming-area-container {
    flex-grow: 1;
  }
</style>

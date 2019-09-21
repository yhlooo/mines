<template>
    <div class="game-area">
      <difficulty-selector></difficulty-selector>
    </div>
</template>

<script>
import DifficultySelector from '@/components/DifficultySelector.vue'

export default {
  name: 'GameArea',
  components: { DifficultySelector }
}
</script>

<style lang="less" scoped>
  @import '../assets/theme/default.less';

  .game-area {
    width: 100%;
    height: 100%;

    background-color: @main-bg-color;
  }
</style>

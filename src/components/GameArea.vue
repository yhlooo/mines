<template>
    <div class="game-area">
      <difficulty-selector
        v-show="status === 'difficulty'"
        :submit-difficulty="submitDifficulty"
      />
      <mines
        v-show="status !== 'difficulty'"
        :difficulty="difficulty"
      />
    </div>
</template>

<script>
import DifficultySelector from '@/components/DifficultySelector.vue'
import Mines from '@/components/Mines.vue'

export default {
  name: 'GameArea',
  components: { DifficultySelector, Mines },
  data () {
    return {
      status: 'gaming',
      difficulty: { height: 8, width: 8, mines: 10 }
    }
  },
  methods: {
    submitDifficulty (difficulty) {
      this.difficulty = difficulty
      this.status = 'ready'
    }
  }
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

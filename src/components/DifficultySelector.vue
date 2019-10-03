<template>
    <div class="difficulty-selector" ref="difficultySelector">
      <div class="center-block" :style="{ width: centerBlockWidth + 'px', height: centerBlockWidth + 'px' }">
        <div class="diff-block">
          <button @click="submitDifficulty(8, 8, 10)">
            <img src="../assets/images/diff-88.png" alt="">
          </button>
        </div>
        <div class="diff-block">
          <button @click="submitDifficulty(16, 16, 40)">
            <img src="../assets/images/diff-1616.png" alt="">
          </button>
        </div>
        <div class="diff-block">
          <button @click="submitDifficulty(30, 16, 99)">
            <img src="../assets/images/diff-1630.png" alt="">
          </button>
        </div>
        <div class="diff-block">
          <button @click="customerDiff">
            <img src="../assets/images/diff-custom.png" alt="">
          </button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'DifficultySelector',
  data () {
    return {
      centerBlockWidth: 0
    }
  },
  mounted () {
    this.resizeContainer()
    window.onresize = this.resizeContainer
  },
  methods: {
    resizeContainer () {
      let height = this.$refs.difficultySelector.clientHeight
      let width = this.$refs.difficultySelector.clientWidth
      this.centerBlockWidth = width < height ? width : height
    },
    customerDiff () {
      if (confirm('目前“自定义雷区”还未开发完毕，只有最基础的功能，你可以继续使用，但你需要自己保证输入是合适的。\n如果你输入的数值过大，或者完全不合理（比如 地雷数目 > 格子总数 - 9）,则可能因此导致浏览器卡死！\n是否要继续使用？')) {
        let width = prompt('雷区宽度', '30')
        let height = prompt('雷区高度', '16')
        let mines = prompt('地雷数目', '99')
        this.submitDifficulty(width, height, mines)
      }
    },
    submitDifficulty (width, height, mines) {
      return this.$router.push(`/game/${width}/${height}/${mines}`)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../assets/theme/default.less';

  .difficulty-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .center-block {
    display: flex;
    padding: 10px;
    flex-wrap: wrap;

    .diff-block {
      width: 50%;
      height: 50%;
      padding: 10px;
      button {
        width: 100%;
        height: 100%;
        .default-btn;
      }
    }
  }
</style>

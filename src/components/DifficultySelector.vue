<template>
    <div class="difficulty-selector" ref="difficultySelector">
      <div class="center-block" :style="{ width: centerBlockWidth + 'px', height: centerBlockWidth + 'px' }">
        <div class="diff-block">
          <button><img src="../assets/images/diff-88.png" alt=""></button>
        </div>
        <div class="diff-block">
          <button><img src="../assets/images/diff-88.png" alt=""></button>
        </div>
        <div class="diff-block">
          <button><img src="../assets/images/diff-88.png" alt=""></button>
        </div>
        <div class="diff-block">
          <button><img src="../assets/images/diff-88.png" alt=""></button>
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

<template>
    <div class="game-area">
      <router-view />
    </div>
</template>

<script>
export default {
  name: 'GameArea',
  data () {
    return {
    }
  },
  methods: {
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

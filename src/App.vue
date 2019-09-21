<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  @import 'assets/libs/fontawesome/css/all.css';

  @font-face {
    font-family: 'Ubuntu';
    src: url('assets/fonts/Ubuntu-R.ttf');
  }
  @font-face {
    font-family: 'Ubuntu Bold';
    src: url('assets/fonts/Ubuntu-B.ttf');
  }

  * {
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
  }
  #app {
    font-family: 'Ubuntu', sans-serif;
    background-color: #ffffff;
    width: 100vw;
    height: 100vh;
  }
</style>

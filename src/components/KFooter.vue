<template>
  <div class="footer">
    <div>Copyright &copy; <a href="https://github.com/keybrl/">KeybrL</a> All Rights Reserved.</div>
    <div><a href="https://github.com/keybrl/keybrl-mines/">
      <i class="fab fa-github"></i> keybrl/keybrl-mines
    </a></div>
  </div>
</template>

<script>
export default {
  name: 'KFooter'
}
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    width: 100%;
    height: 40px;
    padding: 10px 20px;
    justify-content: space-between;

    background-color: #1b1b1b;
    color: #969696;
    font-size: 14.2px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;

    a {
      text-decoration: none;
      &, &:link, &:visited {
        color: #c8c8c8;
      }
      &:hover {
        color: #ffffff;
      }
    }

    i {
      color: #ffffff;
    }
  }
</style>

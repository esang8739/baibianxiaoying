<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
* {
  /* 禁止长按屏幕复制内容*/
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
input,
textarea {
  /*用上边的禁止复制方法后 此时在ios手机有问题，所有的输入框自动失去焦点无法输入内容,*/
  -webkit-user-select: auto;
}
</style>

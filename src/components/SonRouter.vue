<template>
  <div>
    <h1>这是子路由组件</h1>
  </div>
</template>

<script>
export default {
  name: 'SonRouter',
  created() {
     console.log(this.$route);
  },
}
</script>

<style scoped lang="less">

</style>

<template>
  <div class="about">
    <button @click="isShowFlag = !isShowFlag">{{ isShowFlag ? '隐藏' : '显示' }}</button>
    <transition name="temp">
      <h1 v-if="isShowFlag">hello world transtion </h1>
    </transition>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      isShowFlag: true
    };
  },
  watch: {},
  created() {
    console.log("About -s");
    console.log(this.$route);
    console.log("About -e");
  }
};
</script>

<style lang="less" scoped>
.temp-enter-active,
.temp-leave-active {
  transition: all 1s;
}
.temp-enter,
.temp-leave-to {
  opacity: 0;
}
</style>
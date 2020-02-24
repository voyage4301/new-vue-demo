<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="../assets/logo.png"
    >
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  data() {
    return {
      msg: "111"
    };
  },
  components: {
    HelloWorld
  },
  beforeRouteEnter(to, from, next) {
    console.log("首页组件前置守卫 -s");
    console.log("首页组件前置守卫 -e");
    console.log("this: ");
    // beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建。
    console.log(this); // undefined
    next(vm => {
      console.log("vm: ");
      console.log(vm.msg); // 111 能访问到当前组件实例
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log("首页组件更新守卫 -s");
    console.log("首页组件更新守卫 -e");
    next();
  },
  beforeRouteLeave(to, from, next) {
    // 这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 next(false) 来取消。
    console.log("首页组件后置守卫 -s");
    console.log("首页组件后置守卫 -e");
    let flag = this.msg;
    if (flag) {
      next();
    } else {
      next(false);
    }
  }
};
</script>

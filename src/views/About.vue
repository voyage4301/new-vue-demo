<template>
  <div class="about">
    <button @click="isShowFlag = !isShowFlag">{{ isShowFlag ? '隐藏' : '显示' }}</button>
    <transition name="temp">
      <h1 v-if="isShowFlag">hello world transtion </h1>
    </transition>
    <div>{{ count  }}</div>
    <button @click="setNum({ str: '123' })">增加</button>
    <button @click="addNum({ str: '123' })">增加</button>
    <button @click="localaddNum({ str: '123' })">增加</button>

    <button @click="addNumSync({ str: '123' })">异步增加</button>
    <button @click="localaddNumSync({ str: '123' })">异步增加</button>
    <div>{{ count1  }}</div>
    <div>{{ count2  }}</div>

    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "About",
  data() {
    return {
      isShowFlag: true,
      localCount: 99
    };
  },
  computed: {
    ...mapState({
      count: state => state.count,
      count1: "count1",
      count2(state) {
        return state.count2 + this.localCount;
      }
    }),
    ...mapGetters(["foodsFilter", "foodsFilter1"]),
    ...mapGetters({
      currentFoods: "foodsFilter"
    })
  },
  /* computed: {
    ...mapState(["count", "count1", "count2"])
  }, */
  created() {
    console.log("About -s");
    console.log(this.$route);
    console.log("About -e");
    console.log(this.$store.getters.foodsFilter);
    console.log(this.$store.getters.foodsFilter1);
    console.log(this.$store.getters.foodsFilterWithPrice(20));
    console.log("---------------------------");
    console.log(this.foodsFilter);
    console.log(this.foodsFilter1);
    console.log(this.currentFoods);
  },
  methods: {
    setNum() {
      /* muation */
      this.$store.commit("addNum", { str: "123" }); // {str: "123"}
      // this.$store.commit({type: "addNum", options: {str: '123'}}); // {type: "addNum", options: {…}}

      /* action */
      // this.$store.dispatch('addNumSync')
      // this.$store.dispatch("addNumSync", { str: "123" });
      // this.$store.dispatch({ type: "addNumSync", options: { str: 123 } });
      // this.$store.dispatch({ type: "addNumPromise", options: { str: 123 } });
      this.$store.dispatch({ type: "addNumAsync2", options: { str: 123 } });
    },
    ...mapMutations(["addNum"]),
    ...mapMutations({ localaddNum: "addNum" }),

    ...mapActions(["addNumSync"]),
    ...mapActions({ localaddNumSync: "addNumSync" }),

    ...mapActions({ localaddNumSync: "addNumSync" })
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
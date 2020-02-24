<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="gotoAbout">跳转到About</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {};
  },
  computed: {
    localRoute() {
      return this.$route;
    }
  },
  created() {
    console.log("HelloWorld -s");
    console.log(this.$route);
    console.log(this.$router);
    console.log("HelloWorld -e");
  },
  methods: {
    gotoAbout() {
      // this.$router.push('/about') // 跳转到 /about
      this.$router.push('/about/王五/18/sonrouter') // 跳转到 /about/王五/18/sonrouter
      // this.$router.push({path:'/about'}) // 跳转到 /about
      // this.$router.push({ path: "/about", params: { name: "王五", age: 18 } }); // 跳转到 /about
      // this.$router.push({ name: "About", params: { name: "王五", age: 18 } }); // 跳转到 /about/王五/18
      /* this.$router.push({
        name: "About",
        query: { plan: "private" },
        params: { name: "王五", age: 18 }
      }); // 跳转到 /about/王五/18?plan=private */
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

# 1. 新版 vue-cli 脚手架使用笔记

## 1.1 入口文件基础配置 main.js

```js
import Vue from "vue"; // 引入vue
import App from "./App.vue"; // 引入主视图容器
import router from "./router"; // 引入路由配置文件
import store from "./store"; // 引入 vuex 全局数据管理配置文件

Vue.config.productionTip = false; // 生产环境 控制台隐藏警告和消息

/* 初始化 vue 实例, 给当前实例加入路由数据管理和主视图, 并挂载在 #app 这个 DOM 元素上 */
new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
```

## 1.2 路由基础配置文件 /router/index.js

```js
import Vue from "vue"; // 引入 vue
import VueRouter from "vue-router"; // 引入 vue-router
import Home from "../views/Home.vue"; // 引入 Home 视图组件
Vue.use(VueRouter); //  vue 实例使用路由

// 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
/* const Home = () => import('@/components/home')
const Index = () => import('@/components/index')
const About = () => import('@/components/about') */
// 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。 把组件按组分块
const Home = () =>
  import(/* webpackChunkName: 'ImportFuncDemo' */ "@/components/home");
const Index = () =>
  import(/* webpackChunkName: 'ImportFuncDemo' */ "@/components/index");
const About = () =>
  import(/* webpackChunkName: 'ImportFuncDemo' */ "@/components/about");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about/:name/:age",
    name: "About"
    // 1. vue 异步 实现按需加载
    // component: resolve => require(['../views/About.vue'], resolve)
    // 2. es 提案 import 实现按需加载
    // 2.1 下面代码，没有指定webpackChunkName，每个组件打包成一个js文件。
    // component: () => import('../views/About.vue')
    // 2.2 下面代码，指定了相同的webpackChunkName，会合并打包成一个js文件 (合并打包的方式!!!)
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // component: () => import(/* webpackChunkName: "about" */ '@/components/NotFound')
    // 3. require.ensure 实现按需加载
    // resolve => require.ensure([], () => resolve(require('../views/About.vue')), 'demo')
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
    /* 当路由匹配上了  /about/:name/:age/sonrouter 时, Sourouter 组件会渲染在 About 组件的 <router-view /> 中 */
      {
        path: 'sonrouter',
        name: 'Sonrouter',
        component: () => import(/* webpackChunkName: "sonRouter" */ '@/components/SonRouter')
      }
    /* 当路由匹配上了 /about/:name/:age 时,  NoData 组件会渲染在 About 组件的 <router-view /> 中*/
      {
        path: '',
        name: 'NoData',
        component: () => import(/* webpackChunkName: "noData" */ '@/components/NoData')
      }
    // ...其他子路由
    ]
  },
  /* 命名视图  */
  {
      path: '/more',
      name: 'More'
      /* 注意 这里是 components  sssss!!!! */
      components: {
        default: () => import(/* webpackChunkName: "noData" */ '@/components/More'),
        a: () => import(/* webpackChunkName: "noData" */ '@/components/a'),
        b: () => import(/* webpackChunkName: "noData" */ '@/components/b')
      }

      /* 对应的视图 */
      /*
      <router-view></router-view>
      <router-view name="a"></router-view>
      <router-view name="b"></router-view>
      */
  },
  /* 重定向 */
  { path: '/temp', redirect: '/more' }, //常规 重定向
  { path: '/temp', redirect: { name: 'More' }}, // 或者这样 重定向
  { path: '/temp', redirect: to => { // 再或者 重定向
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
  }},
  /* 别名 */
  // 当访问 /bbb 时 url 会展示 /bbb, 但实际展示的视图时 /aaa 的 A
  { path: '/aaa', component: A, alias: '/bbb' },
  {
    // 会匹配以 `/user-` 开头的任意路径
    path: "/user-*",
    component: () => import(/* webpackChunkName: "notfound" */ "@/components/NotFound")

    /* 注意:  */
    // this.$router.push('/user-admin')
    // this.$route.params.pathMatch // 'admin'
  },
  {
    // 会匹配所有路径
    path: "*",
    component: () => import(/* webpackChunkName: "notfound" */ "@/components/NotFound")

    /* 注意:  */
    // this.$router.push('/non-existing')
    // this.$route.params.pathMatch // '/non-existing'
  }
];

/* 匹配优先级: 匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。 */
/* 高级匹配模式: 详情查看官方文档...  例如: */
/*
 { path: '/optional-params/:foo?' }
 { path: '/params-with-regex/:id(\\d+)' }
 { path: '/asterisk/*' }
*/

const router = new VueRouter({
  // 初始化路由
//   mode: 'history', // html5 histroy模式
  routes
});

export default router; // 暴露配置 供入口文件 main.js 引入
```

### 1.2.1 this.$router 和 this.$route

- 通过注入路由器，我们可以在任何组件内通过 `this.$router` 访问路由器，也可以通过 `this.$route` 访问当前路由
- `this.$router` 相当于一个全局的路由器对象，包含了很多属性和对象（比如 history 对象），任何页面都可以调用其 push(), replace(), go() 等方法
- `this.$route` 表示当前路由对象，每一个路由都会有一个 route 对象，是一个局部的对象，可以获取对应的 name, path, params, query 等属性。

1. `this.route`

```js
// 路由
{
    path: '/about/:name/:age',
    name: 'About',
    component: function () {
      return import('../views/About.vue')
    }
}

// 在父组件中:
<router-link to="/about/张三/18">About</router-link>

// 子组件中:
created() {
    console.log('About -s')
    console.log(this.$route)
    /*
    fullPath: "/about/张三/18"
    name: "About"
    params: {name: "张三", age: "18"}
    path: "/about/张三/18"
    */
    console.log('About -e')
}
```

1. 1 `this.$router.push`

```text
想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。
当你点击 <router-link> 时，这个方法会在内部调用，所以说，点击 <router-link :to="..."> 等同于调用 router.push
```

- 声明式 `<router-link :to="...">`
- 编程式 `router.push(...)`

```js
/* 正确使用 */
this.$router.push("/about"); // 跳转到 /about
this.$router.push("/about/王五/18"); // 跳转到 /about/王五/18
this.$router.push({ path: "/about" }); // 跳转到 /about
this.$router.push({ name: "About", params: { name: "王五", age: 18 } }); // 跳转到 /about/王五/18

/* 错误 或者 不建议使用 */
this.$router.push({ path: "/about", params: { name: "王五", age: 18 } }); // 跳转到 /about 不带参数

this.$router.push({
  name: "About",
  query: { plan: "private" },
  params: { name: "王五", age: 18 }
}); // 跳转到 /about/王五/18?plan=private
```

1. 2 `this.$router.replace()`

```text
跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。
```

- 声明式 `<router-link :to="..." replace >`
- 编程式 `router.replace(...)`

1. 3 `this.$router.go(n)`

```text
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。
```

```js
// 在浏览器记录中前进一步，等同于 history.forward()
this.$router.go(1);

// 后退一步记录，等同于 history.back()
this.$router.go(-1);

// 前进 3 步记录
this.$router.go(3);

// 如果 history 记录不够用，那就默默地失败呗
this.$router.go(-100);
this.$router.go(100);
```

### 1.2.2 全局前置守卫 beforeEach

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  next() // 进行管道中的下一个钩子
  next(false) // 中断当前的导航。
  next('/') 或者 next({ path: '/' }) // 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
  next(error): //(2.4.0+) 如果传入 next 的参数是一个 Error 实例，
})
```

```text
to: Route: 即将要进入的目标 路由对象

from: Route: 当前导航正要离开的路由

next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
```

### 1.2.3 全局解析守卫 beforeResolve

```text
用法和beforeEach类似 ( 2.5.0+)
```

```js
router.beforeResolve((to, from, next) => {
  next();
});
```

### 1.2.4 全局后置钩子 afterEach

```text
不会接受 next 函数也不会改变导航本身
```

```js
router.afterEach((to, from) => {
  // ....
});
```

### 1.2.5 路由独享守卫 beforeEnter

```text
用法和全局前置守卫 beforeEnter 一样
```

```js
 {
    path: '/',
    name: 'Home',
    component: Home,
    alias: '/home',
    beforeEnter: (to, from, next) => {
      console.log('首页路由独享前置守卫 -s');
      console.log(to);
      console.log(from);
      console.log('首页路由独享前置守卫 -e');
      next()
    }
  }
```

### 1.2.6 组件内的守卫

```text
beforeRouteEnter
beforeRouteUpdate (2.2 新增)
beforeRouteLeave
```

```js
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
```

### 1.2.7 路由守卫总结

1. 全局守卫(3 个)

- 配置在 router 实例上

```js
router.beforeEach((to, from, next) => {
  next();
});
router.ResolveEach((to, from, next) => {
  next();
});
router.afterEach((to, from, next) => {
  next();
});
```

2. 路由独享守卫(1 个)

- 配置在单个路由配置对象里

```js
{
  // ...
  beforeEnter: (to, from, next) => {
    next();
  };
}
```

3. 组件内的守卫(3 个)

- 配置在组件的 vue 实例对象中

```js
export default {
  name: "Home",
  components: {
    HelloWorld
  },
  beforeRouteEnter(to, from, next) {
    //这个钩子里不能访问this 因为此时组件还没有加载 vue实例还未初始化
    console.log(this); // undefined
    next(vm => {
      console.log("vm: ");
      console.log(vm.msg); // 111 能访问到当前组件实例
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
  beforeRouteLeave(to, from, next) {
    let flag = this.msg;
    if (flag) {
      next();
    } else {
      next(false);
    }
  }
};
```

4. 完整的导航解析流程

- 导航被触发。
- 在失活的组件里调用离开守卫。(beforeRouteLeave)
- 调用全局的 beforeEach 守卫。(beforeEach)
- 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。(beforeRouteUpdate)
- 在路由配置里调用 beforeEnter。(beforeEnter)
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。(beforeRouteEnter)
- 调用全局的 beforeResolve 守卫 (2.5+)。(beforeResolve)
- 导航被确认。
- 调用全局的 afterEach 钩子。(afterEach)
- 触发 DOM 更新。
- 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

5. 伪代码描述流程

```text
当从 a 切换到 b时, 触发的流程如下:
1. a组件内的beforeRouteLeave
2. 全局的前置beforeEach
<!-- 3. a组件内的beforeRouteUpdate  -->
4. 路由配置中的beforeEnter
5. b组件内的beforeRouteEnter
6. 全局的beforeResolve
7. 全局的afterEach
```

### 过渡动效 <transtion> <需要做动画的组件/> </transtion>

```html
<button @click="isShowFlag = !isShowFlag">
  {{ isShowFlag ? '隐藏' : '显示' }}
</button>
<transition name="temp">
  <h1 v-if="isShowFlag">hello world transtion</h1>
</transition>
```

```js
 data() {
    return {
      isShowFlag: true
    };
  },

```

```less
.temp-enter-active,
.temp-leave-active {
  transition: all 1s;
}
.temp-enter,
.temp-leave-to {
  opacity: 0;
}
```

## 1.3 全局数据管理基础配置文件 vuex store/index.js

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 全局数据对象
  },
  mutations: {
    // 同步管理数据
  },
  actions: {
    // 异步管理数据
  },
  modules: {
    // 模块化
  }
});
```

## 1.4 组件

```vue
/* tempalet 模板 */
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

/* script 脚本文件 */
<script>
import HelloWorld from "@/components/HelloWorld.vue"; // 引入子组件

export default {
  // 暴露给引用者
  name: "Home", // 组件名
  components: {
    // 局部引用的子组件
    HelloWorld
  }
};
</script>

/* 样式文件 */ /* lang代表使用的样式为less,
scoped代表当前页面的样式只供当前页面模板使用, 不会暴露给外层和全局 */
<style lang="less" scoped>
.home {
  font-size: "14px";
  img {
    width: 20px;
    height: 20px;
  }
}
</style>
```

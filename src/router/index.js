import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
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
  },
  {
    path: '/about/:name/:age',
    name: 'About',
    // component: resolve => require(['../views/About.vue'], resolve)
    // component: () => import('../views/About.vue')
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      {
        path: 'sonrouter',
        name: 'Sonrouter',
        component: () => import(/* webpackChunkName: "sonRouter" */ '@/components/SonRouter')
      }
    ]
  },
  {
    // 会匹配以 `/user-` 开头的任意路径
    path: '/user-*',
    component: () => import(/* webpackChunkName: "notfound" */ '@/components/NotFound')
  },
  {
    // 会匹配所有路径
    path: '*',
    component: () => import(/* webpackChunkName: "notfound" */ '@/components/NotFound')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log('全局前置守卫 -s');
  console.log(to);
  console.log(from);
  console.log('全局前置守卫 -e');
  next()
})

router.beforeResolve((to, from, next) => {
  console.log('全局解析守卫 -s');
  console.log(to);
  console.log(from);
  console.log('全局解析守卫 -e');
  next()
})

router.afterEach((to, from) => {
  console.log('全局后置钩子 -s');
  console.log(to);
  console.log(from);
  console.log('全局后置钩子 -e');
})

export default router

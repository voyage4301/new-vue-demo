import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1111,
    count1: 2222,
    count2: 333,
    foods: [
      { name: '水果', price: 10 },
      { name: '蔬菜', price: 5 },
      { name: '肉食', price: 20 },
      { name: '面食', price: 7 },
    ]
  },
  getters: {
    // 通过属性访问 Getter 接受 state 作为其第一个参数
    foodsFilter(state) {
      console.log(this); // undefined
      return state.foods.filter(v => v.price < 10)
    },
    /* Getter 也可以接受其他 getter 作为第二个参数 */
    foodsFilter1(state, getters) {
      return state.foods.filter(v => v.price < getters.otherFilter)
    },
    otherFilter() {
      return 10
    },
    /* 你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。 */
    foodsFilterWithPrice(state) {
      return (price = 20) => {
        return state.foods.filter(v => v.price < price)
      }
    }
  },
  mutations: {
    addNum(state, options) {
      console.log('执行mutaions');
      
      console.log(options)
      state.count++
      // this.state.count++
    }
  },
  actions: {
    /**
     * Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象 
     * 因此你可以调用 context.commit 提交一个 mutation
     * 或者通过 context.state 和 context.getters 来获取 state 和 getters
     * context 对象不是 store 实例本身!!!!!
     */
    addNum(context) {
      console.log('执行action2');
      context.commit('addNum', { str: '123' })
    },
    addNumSync(context, options) {
      console.log(options);
      setTimeout(() => {
        context.commit('addNum', { str: '123' })
      }, 1000)
    },
    addNumPromise({ commit }, options) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(options);
          commit('addNum', { str: '123' })
          resolve()
        }, 1000);
      })
    },
    async addNumAsync1(context) {
      console.log('执行action1');
      context.commit('addNum', { str: '123' })
    },
    async addNumAsync2({ commit, dispatch }, options) {
      await dispatch('addNumAsync1')
      console.log(options);
      commit('addNum', {str: '123'})
    }
  },
  modules: {
  }
})

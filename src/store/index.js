import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

const TOUTIAO_KEY = 'TOUTIAO_USER'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 处理用户TOKEN
    user: getItem(TOUTIAO_KEY)
  },
  getters: {},
  mutations: {
    setUser (state, data) {
      state.user = data
      setItem(TOUTIAO_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})

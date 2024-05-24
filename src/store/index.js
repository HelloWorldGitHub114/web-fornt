import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const actions = {

}
const mutations = {
  changeMusicInfo(state, info) {
    state.globalMusicInfo = info
  },
  changeMusicQueue(state, obj) {
    let ids = []
    for (const item of state.musicQueue) {
      ids.push(item.id)
    }
    if (!ids.includes(obj.id))
      state.musicQueue.push(obj)
  },
  changeNowIndex(state, index) {
    state.nowIndex = index
  },
  clearMusicQueue(state) {
    state.musicQueue = []
  },
  deleteMusic(state, id) {
    let queue = state.musicQueue;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].id === id) {
        queue.splice(i, 1)
      }
    }
  },
}
const state = {
  musicQueue: [],
  globalMusicInfo: {},
  nowIndex: 0
}
export default new Vuex.Store({
  actions, mutations, state,
})
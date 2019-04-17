import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state:function () {
    return {
      select:0
    }
  },
  mutations:{
    //数据处理方法

  },
  getters:{
    //数据包装，计算属性
  },

})

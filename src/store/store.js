import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
Vue.use(Vuex);

export default new Vuex.Store({
  state:function () {
    return {
      select:0,
      schemes: [],
      treeData: [],
    }
  },
  mutations:{
    //数据处理方法
    setSchemes(state, payload){
      state.schemes = payload;
    },
    setTreeData(state,payload){
      state.treeData = payload;
    }
  },
  getters:{
    //数据包装，计算属性
    treeData(state){
      return _.get(state.treeData, '0');
    },
    schemes(state){
      return state.schemes;
    }
  },

})

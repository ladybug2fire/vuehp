import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
Vue.use(Vuex);

export default new Vuex.Store({
  state:function () {
    return {
      select:0,
      schemes: [{name:'杭州'},{name: '北京'}],
      treeData: [{name: '旅行',child:[{name: '费用',child:[]},{name:'交通', child:[{name:'高速',child:[]}, {name: '国道',child:[]}]}, {name: '饮食',child:[]}]}],
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

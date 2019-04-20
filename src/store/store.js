import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import * as math from 'mathjs'
import {genArray, tree2map,isValid} from '../components/createviews/matrixviews/matrixutil'
Vue.use(Vuex);

export default new Vuex.Store({
  state:function () {
    return {
      select:0,
      schemes: [],//[{"name":"杭州","id":"GQzWA4iqo"},{"name":"上海","id":"Z8idMS6y2"}],
      treeData:[],// [{"id":"9Am94BjpJ","name":"旅游","level":1,"child":[{"id":"Bz749WrQN","name":"饮食","level":2,"child":[]},{"id":"_PKbWECha","name":"交通","level":2,"child":[{"id":"eB_NwY706","name":"国道","level":3,"child":[]},{"id":"7fB44Mhq8","name":"高速","level":3,"child":[]}]},{"id":"bJsMH3wo1","name":"费用","level":2,"child":[]}]}],
      matrixs:{},
      calResult: {},
      isCheckPass: true,
      WD: [],//方案评估矩阵
      WA: [],//总排序权重
      WP: [],//单排序权重
    }
  },
  mutations:{
    setWD(state,payload){
      state.WD = payload
    },
    setWA(state, payload){
      state.WA = payload
    },
    setWP(state, payload){
      state.WP = payload
    },
    setSchemes(state, payload){
      state.schemes = payload;
    },
    setTreeData(state,payload){
      state.treeData = payload;
    },
    setMatrixs(state) {
      let obj = {};
      let maps = tree2map(state.treeData);
      _.each(maps, e=>{
        const n = e.child.length;
        if(n)obj[e.id] = math.ones(n+1, n+3)
        else {
          const n2 = state.schemes.length;
          obj[e.id] = math.ones(n2+1, n2+3)
        }
      })
      state.matrixs = obj;
    },
    setCalResult(state, payload){
      state.calResult[payload.key] = payload.value
    },
    setMatrix(state,payload){
      const {key, matrix} = payload;
      _.set(state.matrixs, key, matrix)
      state.matrixs = _.assign({}, state.matrixs)
    }
  },
  getters:{
    //数据包装，计算属性
    treeData(state){
      return _.get(state.treeData, '0');
    },
    schemes(state){
      return state.schemes;
    },
    tree(state){
      return genArray(_.get(state.treeData, '0'), state.schemes)
    },
    // 因为id 唯一可以平铺
    tree2map(state){
      return tree2map(state.treeData);
    },
    rootid(state){
      return _.get(state.treeData,'0.id')
    },
    matrixs(state){
      return state.matrixs;
    },
    calResult(state){
      return state.calResult;
    }
  },
})
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
      schemes: [],
      treeData:[],
      matrixs:{},
      calResult: {},
      WD: [],//方案评估矩阵
      WA: [],//总排序权重
      WP: [],//单排序权重
    }
  },
  actions:{
    getData({state},payload){
      return _.cloneDeep(state.schemes);
    },
    getTree({state}, payload){
      return _.cloneDeep(state.treeData); 
    }
  },
  mutations:{
    // 初始化清空 treeData等等 
    initial(state){
      state.schemes = []
      state.treeData = []
      state.matrixs = {}
    },
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
    setMatrixs(state,payload) {
      if(payload){
        // NOTE: 这是查看的情况
        let obj = {};
        _.forIn(payload, (e,k)=>{
          _.set(obj, k, math.matrix(e).map(v=>{
            if(typeof v === 'object'){
              // NOTE: 解析JSON时，fraction对象未能正常解析，需要手动构造
              return math.fraction(v.n, v.d)
            }else{
              return v
            }
          }))
        })
        state.matrixs = obj;
      }else{
        // NOTE: 这是新建的情况，直接新建单位矩阵填充矩阵
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
      }
    },
    setCalResult(state, payload){
      state.calResult[payload.key] = payload.value
      state.calResult = _.assign({}, state.calResult)
    },
    setMatrix(state,payload){
      // NOTE: 对应每个表的计算过程中修改表中值。整个表格数据替换才能触发Vue页面更新
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
    // 根节点ID
    rootid(state){
      return _.get(state.treeData,'0.id')
    },
    matrixs(state){
      return state.matrixs;
    },
    calResult(state){
      return state.calResult;
    },
  },
})
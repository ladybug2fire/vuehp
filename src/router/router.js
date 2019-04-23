import Vue from 'vue'
import Router from 'vue-router'
import Start from '../components/Start'
import Home from '../components/Home'
import store from '../store/store'
import {getData} from '@/api.js'
import _ from 'lodash'

Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/',
      name:'start',
      component:Start
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children:[
        {
          path:'create',
          name:'create',
          beforeEnter(routeTo, routeFrom, next) {
            if(routeTo.query.id){
              getData({params:{
                id: routeTo.query.id
              }}).then(res=>{
                // 进页面前先获取数据，避免生命周期的问题
                const treeData = _.get(res, 'data.data.treeData.data');
                const matrix = _.get(res, 'data.data.matrix.data');
                const scheme = _.get(res, 'data.data.scheme.data');
                treeData && store.commit('setTreeData', JSON.parse(treeData))
                scheme && store.commit('setSchemes', JSON.parse(scheme))
                matrix && store.commit('setMatrixs', JSON.parse(matrix))
                next();
              })
            }else{
              store.commit('initial')
              next();
            }
          },
          component: () => import('../components/Create'),
        },
        {
          path:'history',
          name:'history',
          component: () => import('../components/History')
        }
      ]
    }
  ]
})

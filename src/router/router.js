import Vue from 'vue'
import Router from 'vue-router'
import Start from '../components/Start'
import Home from '../components/Home'
import step1tree from '../components/createviews/step1tree'

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

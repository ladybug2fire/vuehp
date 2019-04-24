import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router/router'
import store from './store/store'
import Components from './components/tree'
import Vuex from 'vuex'

Vue.use(ElementUI);
Vue.use(Components)
Vue.use(Vuex);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

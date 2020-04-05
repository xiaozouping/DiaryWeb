// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


//引入element-ui
import ElementUI from 'element-ui'; //引入核心js组件
import 'element-ui/lib/theme-chalk/index.css';//引入依赖的样式
Vue.use(ElementUI) //引用



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

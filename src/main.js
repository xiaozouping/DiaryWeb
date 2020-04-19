import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios';
Vue.prototype.$axios = axios;

// import VueI18n from 'vue-i18n';

// v-dialogDrag: 弹窗拖拽属性
import './components/common/directives'
import './assets/css/icon.css'

//引入element-ui
import ElementUI from 'element-ui'; //引入核心js组件
import 'element-ui/lib/theme-chalk/index.css';//引入依赖的样式
Vue.use(ElementUI) //引用

Vue.config.productionTip = false

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | vue-manage-system`;
  const role = localStorage.getItem('ms_username');
  if (!role && to.path !== '/login') {
    next('/login');
  } else if (to.meta.permission) {
    // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
    role === 'admin' ? next() : next('/403');
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, //注册路由
  components: { App }, //映射组件标签

  template: '<App/>'   //指定需要渲染到页面的模板
})

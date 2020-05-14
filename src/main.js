import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios';
Vue.prototype.$axios = axios;


import store from './store'

// v-dialogDrag: 弹窗拖拽属性
// import './assets/css/icon.css'

//引入element-ui
import ElementUI from 'element-ui'; //引入核心js组件
import 'element-ui/lib/theme-chalk/index.css';//引入依赖的样式
Vue.use(ElementUI) //引用

Vue.config.productionTip = false

// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
// next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
// next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
// next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        // this.$message({message:"您还未登录，请先登录！",type:"warning"})
        next('/login');
    }
    else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'zouping' ? next() : next('/403');
    }
    else {
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




// router.beforeEach((to, from, next) => {
//     if (to.meta.requireAuth) {
//         if (store.state.admin.username) {
//             next()
//         } else {
//             next({
//                 path: 'login',
//                 query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             })
//         }
//     } else {
//         next()
//     }
// })



/* eslint-disable no-new */
new Vue({
    el: '#app',
    router, //注册路由
    components: { App }, //映射组件标签
    store,
    template: '<App/>'   //指定需要渲染到页面的模板
})

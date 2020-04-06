import Vue from 'vue'
import Router from 'vue-router'
import Login from "../views/Login"
import Index from "../views/Index"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录页面',
      component: Login
    },
    {
      path:'/index',
      component:Index
    }
  ]
})

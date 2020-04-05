import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from "../views/Login"
import Main from "../views/Main"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: '登录页面',
      component: Login
    },
    {
      path:'/main',
      name:'首页',
      component:Main
    }
  ]
})

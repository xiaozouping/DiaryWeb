import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home.vue';
// import Dashboard from '../components/page/Dashboard';
// import Icon from "../components/page/Icon";
import OrderManage from "../components/page/OrderManage";
import MessageCenter from "../components/page/MessageCenter";
import AdminManage from "../components/page/AdminManage";
// import BaseForm from "../components/page/BaseForm";
// import VueEditor from "../components/page/VueEditor";
// import Markdown from "../components/page/Markdown";
// import Upload from "../components/page/Upload";
// import BaseCharts from "../components/page/BaseCharts";
// import DragList from "../components/page/DragList";
// import DragDialog from "../components/page/DragDialog";
// import I18n from "../components/page/I18n";
import Permission from "../components/page/Permission";
import FOT from "../components/page/403";
import FOF from "../components/page/404";
// import Donate from "../components/page/Donate";
import Login from "../components/page/Login";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/404'
    },
    {
      path:'/',
      component:Home,
      meta: { title: '自述文件' },
      children:[
        // {
        //   path: '/dashboard',
        //   component: Dashboard,
        //   meta: { title: '系统首页' }
        // },
        {
          path: '/ordermanage',
          component: OrderManage,
          meta: { title: '订单管理' }
        },
        {
          path: '/adminmanage',
          component: AdminManage,
          meta: { title: '管理员管理' ,permission: true}
          //只有超级管理员才能管理管理员
        },
        {
          path: '/messagecenter',
          component: MessageCenter,
          meta: { title: '消息中心' }
        },
        {
          // 权限页面
          path: '/permission',
          component: Permission,
          meta: { title: '权限测试', permission: true }
        },
        {
          path: '/404',
          component: FOF,
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: FOT,
          meta: { title: '403' }
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      meta: { title: '登录' }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

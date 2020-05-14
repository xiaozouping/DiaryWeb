import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/common/Home.vue';
import HomePage from '../components/page/HomePage';
import OrderManage from "../components/page/OrderManage";
import MessageCenter from "../components/page/MessageCenter";
import AdminManage from "../components/page/AdminManage";
import Permission from "../components/page/Permission";
import FOT from "../components/page/403";
import FOF from "../components/page/404";
import Login from "../components/page/Login";
import AddAdmin from "../components/page/AddAdmin";
import ChangePwd from "../components/page/ChangePwd";
import PersonCenter from "../components/page/PersonCenter";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/homepage'
        },
        {
            path:'/',
            component:Home,
            meta: { title: '公共组件' },
            children:[
                {
                    path: '/homepage',
                    component: HomePage,
                    meta: { title: '首页' }
                },
                {
                    path: '/ordermanage',
                    component: OrderManage,
                    meta: { title: '订单信息' }
                },
                {
                    path: '/adminmanage',
                    component: AdminManage,
                    meta: { title: '管理员信息' , permission: true}
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
                },
                {
                    path:'/addadmin',
                    component:AddAdmin,
                    meta:{title:'新建管理员', permission: true}
                },
                {
                    path:'/changepwd',
                    component:ChangePwd,
                    meta:{title:'修改密码'}
                },
                {
                    path:'/personcenter',
                    component:PersonCenter,
                    meta:{title:'个人信息'}
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

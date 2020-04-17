<template>
    <div class="sidebar">
<!--        collapse：是否水平折叠收起菜单（默认不折叠）-->
<!--        background-color：菜单的背景色（仅支持 hex 格式）-->
<!--        text-color：菜单的文字颜色（仅支持 hex 格式）-->
<!--        active-text-color：当前激活菜单的文字颜色（仅支持 hex 格式）-->
<!--        default-active：当前激活菜单的 index-->
<!--        unique-opened：是否只保持一个子菜单的展开-->
<!--        router：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
<!--        具体内容显示，动态路由跳转-->
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">

                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>

                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index" >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>

                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                              {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-s-home',
                    index: 'homepage',
                    title: '首页'
                },
                {
                    icon: 'el-icon-s-order',
                    index: '2',
                    title: '订单管理',
                    subs: [
                        {
                            index: 'ordermanage',
                            title: '订单信息'
                        }
                    ]
                },
                {
                    icon:'el-icon-message',
                    index:'messagecenter',
                    title:'消息中心'
                },
                {
                    icon: 'el-icon-s-custom',
                    index: '4',
                    title: '管理员管理',
                    subs: [
                        {
                            index: 'adminmanage',
                            title: '管理员信息'
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>

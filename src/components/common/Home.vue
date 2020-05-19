<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <!--                    被包裹在keep-alive中的组件的状态将会被保留-->
                    <!--                    include属性表示只有name属性为tagsList，tagsList的组件会被缓存，（注意是组件的名字，不是路由的名字）-->
                    <keep-alive :include="tagsList" v-if="isRouterAlive">
<!--                        <router-view ></router-view>-->
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <!--                target：触发滚动的对象-->
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from './bus';
    export default {
        provide(){
            return{
                reload:this.reload
            }
        },
        data() {
            return {
                tagsList: [],
                collapse: false,
                isRouterAlive:true
            };
        },
        components: {
            vHead,
            vSidebar,
            vTags
        },
        created() {
            bus.$on('collapse-content', msg => {
                this.collapse = msg;
            });

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for (let i = 0, len = msg.length; i < len; i++) {
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            });
        },
        methods:{
            reload(){
                this.isRouterAlive = false
            // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            },
        }
    };
</script>

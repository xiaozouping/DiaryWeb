<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-home"></i> 首页
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            您好，{{username}}！
            <div class="hello">欢迎进入系统管理后台!</div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'homepage',
        data() {
            return {
                username:''
            }
        },
        created(){
            this.username = sessionStorage.getItem('ms_username');
        },
        methods: {


        }
    };
</script>


<style scoped>
    .container{
        height: 500px;
        width: 95%;
        font-size: 35px;
        line-height: 200px;
        padding-left: 31%;
    }
    .hello{
        font-size: 30px;
        line-height: 0px;
    }
</style>

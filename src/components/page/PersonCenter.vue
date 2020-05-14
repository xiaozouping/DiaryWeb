<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-user-solid"></i> 个人信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" >

        <!-- 修改弹出框 -->

            <el-form ref="form" :model="form" :rules="rules" label-width="100px" >

                <el-form-item label="用户名：" class="input-style">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="密码：" class="input-style" prop="password">
                    <el-input v-model="form.password" type="password" disabled></el-input>
                </el-form-item>

                <el-form-item label="真实姓名：" class="input-style" prop="realname">
                    <el-input  v-model="form.realname" size="middle"></el-input>
                </el-form-item>

                <el-form-item label="电话：" class="input-style" prop="phone">
                    <el-input  v-model="form.phone" size="middle" clearable></el-input>
                </el-form-item>

                <el-form-item label="性别：" class="input-style1">
                    {{form.sex==0?'男':'女'}}
                </el-form-item>

                <el-form-item label="等级：" class="input-style">
                    {{form.admin_rank==0?'超级管理员':'普通管理员'}}
                </el-form-item>

                <el-form-item label="状态：" class="input-style">
                    {{form.admin_state==0?'正常':'不正常'}}
                </el-form-item>

                <el-form-item label="出生日期："  class="input-style">
                    {{form.birth_day}}
                </el-form-item>

                <el-form-item label="创建时间："  class="input-style">
                    {{form.create_time}}
                </el-form-item>

                <el-form-item style="margin-top: 50px;align-items: center">
                    <el-button type="primary" @click="submitForm('form')">修改</el-button>
                </el-form-item>

            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        name: "PersonCenter",
        data(){
            return{
                rules: {
                    realname: [ { required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { pattern: /^(\w){8,20}$/, message: '只能输入8-20个字母、数字、下划线' , trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        { validator:function(rule,value,callback){
                                if(/^1[34578]\d{9}$/.test(value) == false){
                                    callback(new Error("请输入正确的手机号"));
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                },
                form:{}
            }
        },
        created() {

            const _this = this
            _this.form.username = localStorage.getItem('ms_username');
            _this.$axios.post('http://localhost:8181/admin/findpersonal',_this.form).then(function (resp) {
                // console.log(resp.data)
                _this.form = resp.data
                // _this.loading = false
            })

        },
        methods:{
            submitForm(formName) {
                const _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid){
                        console.log(_this.form)
                        _this.$axios.put('http://localhost:8181/admin/updateById',_this.form)
                            .then(function(resp){
                                if(resp.data == '1'){
                                    _this.$message({message:"修改成功！",type:"success"})
                                    window.location.reload()
                                }
                                else {
                                    _this.$message("修改失败！")
                                }
                            })
                    }
                    else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .container{
        padding-left: 150px;
    }
    .input-style{
        width: 350px;
        display: inline-block;
        margin-right: 30px;
        margin-left: 20px;
    }
    .input-style1{
        width: 350px;
        margin-right: 30px;
        margin-left: 20px;
    }
</style>

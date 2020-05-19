<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">系统管理后台</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content" @submit.native.prevent>

                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名" clearable>
                        <el-button slot="prepend" icon="el-icon-user-solid"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" clearable >
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>

                    <el-tooltip class="item" effect="dark" content="请联系超级管理员重置密码！" placement="bottom-start">
                        <div class="forget">忘记密码?</div>
                    </el-tooltip>

                </el-form-item>

                <div class="login-btn">
                    <el-button type="primary" @click="login('ruleForm')" native-type="submit">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Login',
        data: function() {
            return {
                islogin:false,
                checked:true,
                ruleForm: {
                    username: '',
                    password: '',
                },
                userToken:'',
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
            };
        },
        methods: {
            login (formName) {
                const _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // console.log(_this.ruleForm)
                        _this.$axios.post('http://localhost:8181/admin/login', {
                            username: this.ruleForm.username,
                            password: this.ruleForm.password
                        })
                            .then(resp => {
                                console.log(resp)

                                if(resp.data.success == false){
                                    if(resp.data.message == 0){
                                        _this.$message({message:"登录失败，用户名或密码错误！",type:"error"})
                                    }
                                    else if (resp.data.message == 1){
                                        _this.$message("登录失败，该帐号已被删除！")
                                    }
                                    else if (resp.data.message == 2){
                                        _this.$message({message:"该帐号已被冻结，请联系超级管理员！",type:"warning"})
                                    }
                                }
                                else {
                                    sessionStorage.setItem('ms_username',resp.data.data.username);
                                    sessionStorage.setItem('admin_rank',resp.data.data.admin_rank);
                                    _this.$message({message:"登录成功！",type:"success"})

                                    _this.$router.push({ path: _this.redirect || '/' }, onComplete => { }, onAbort => { })
                                }

                            })
                            .catch(failResponse => {
                            })

                    } else {
                        return false;
                    }
                });

            },
        },
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/bcg.jpg) ;
        background-size: 100% 100%;
    }
    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }
    .ms-content {
        padding: 30px 30px;
    }
    .login-btn {
        text-align: center;
    }
    .login-btn button {
        width: 100%;
        height: 36px;
        margin-top: 13px;
        margin-bottom: 7px;
    }
    .forget {
        color: red;
        font-size: 12px;
        position: absolute;
        right: 0;
        top: 45px;
        height: 17px;
        line-height: 17px;
        text-decoration: underline;
        cursor: pointer;
    }
</style>

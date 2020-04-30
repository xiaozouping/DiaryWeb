<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">

                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名" clearable>
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" show-password clearable @keyup.enter.native="submitForm()" >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>

                    <el-tooltip class="item" effect="dark" content="请联系超级管理员修改密码！" placement="bottom-start">
                        <div class="forget">忘记密码?</div>
                    </el-tooltip>

                </el-form-item>

                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
  // import { requestLogin } from '../../api/index'
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
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {    //验证通过 可以提交
                    const _this = this;
                    // this.islogin = true;
                    //将提交的数据进行封装
                    // var loginParams = {Username : this.form.username,Password:this.form.password};

                    _this.$axios.post('http://localhost:8181/admin/save')

                    this.$message.success('登录成功');
                    localStorage.setItem('ms_username', this.form.username);
                    this.$router.push('/');
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
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

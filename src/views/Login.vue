<template>
  <div id="container">
    <el-form ref="loginForm" :model="loginData" :rules="rules" label-width="60px" class="login-box">
      <h3 class="login-title">登录</h3>

      <el-form-item label="账号" prop="username">
        <el-input type="text" placeholder="请输入账号" v-model="loginData.username"/>
      </el-form-item>

      <el-form-item label="密码" prop="password" class="pwd">
        <el-input type="password" placeholder="请输入密码" v-model="loginData.password"/>
        <el-tooltip class="item" effect="dark" content="请联系超级管理员修改密码！" placement="bottom-start">
          <div class="forget">忘记密码?</div>
        </el-tooltip>
      </el-form-item>

      <el-form-item label-width="30px">
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      title="登录失败"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>请输入正确的用户名和密码！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loginData: {
                    username: '',
                    password: ''
                },
                responseResult:[],  //请求结果

                // 表单验证，需要在 el-form-item 元素中增加 prop 属性
                rules: {
                    username: [
                        {required: true, message: '账号不可为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不可为空', trigger: 'blur'}
                    ]
                },

                // 对话框显示和隐藏
                dialogVisible: false
            }
        },
        methods: {
            submitForm(formName) {
                // 为表单绑定验证功能
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.loginData.username != "123" || this.loginData.password != "123") {
                            this.dialogVisible = true;
                            return false;
                        } else {
                            this.$message({
                                message: '登陆成功',
                                type: 'success'
                            });
                            // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
                            this.$router.push("/main");
                        }

                        // axios.post('/login',{
                        //     username: this.loginData.username,
                        //     password: this.loginData.password
                        // })
                        //     .then(successResponse =>{
                        //         if(successResponse.data.code === 200){
                        //             this.$router.replace({path:'/main'})
                        //         }
                        //     })
                        //     .catch(failResponse => {
                        //
                        //     })
                    }
                });
            },
            //重置数据
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //关闭页面
            handleClose() {
                this.centerDialogVisibleSecond = false;
                this.$emit("tyonke", this.centerDialogVisibleSecond);
            }
        }
    }
</script>

<style scoped>
  #container {
    background: url("../assets/bcg.jpg");
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%
  }

  .login-box {
    border: 1px solid #DCDFE6;
    width: 350px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #6aa7d6;
    background-color: white;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    color: #303133;
  }

  .pwd {
    position: relative;
  }
  .forget {
    color: red;
    font-size: 12px;
    position: absolute;
    right: 0;
    top: 43px;
    height: 17px;
    line-height: 17px;
    text-decoration: underline;
    cursor: pointer;
  }
  .el-form-item {
    margin-left: -10px;
  }

  .el-button {
    margin: 15px 15px 5px 10px;
  }
</style>

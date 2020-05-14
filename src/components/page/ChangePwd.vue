<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 修改密码
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="150px" class="ruleForm">

                <el-form-item label="密码：" prop="password" class="input-style">
                    <el-input type="password" v-model="ruleForm.password" show-password clearable></el-input>
                </el-form-item>

                <el-form-item label="确认密码：" prop="checkPass" class="input-style">
                    <el-input type="password" v-model="ruleForm.checkPass" show-password clearable></el-input>
                </el-form-item>

                <el-form-item class="foot">
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ChangePwd",
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    password: '',
                    checkPass: ''
                },
                form:{},
                rules: {
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { pattern: /^(\w){8,20}$/, message: '只能输入8-20个字母、数字、下划线' , trigger: 'blur'}
                    ],
                    checkPass: [
                        { required: true, validator: validatePass2, trigger: 'blur' }
                    ]
                }
            };
        },
        created() {

            const _this = this;
            _this.form.username = localStorage.getItem('ms_username');
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const _this = this;
                        console.log(_this.ruleForm);
                        _this.form.password = _this.ruleForm.password;
                        console.log(_this.form)
                        _this.$axios.put('http://localhost:8181/admin/updateByUsername',_this.form)
                            .then(function(resp){
                                if(resp.data == '1'){
                                    _this.$message({message:"修改成功，请重新登录！",type:"success"});
                                    localStorage.removeItem('ms_username');   //移除本地存储中的ms_username数据
                                    _this.$router.push('/login');
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
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .input-style{
        width: 450px;
    }
    .container{
        height: 350px;
    }
    .ruleForm{
        margin-top: 60px;
    }
    .foot{
        margin-top: 45px;
    }
</style>

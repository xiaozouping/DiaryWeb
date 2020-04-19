<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 添加管理员
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

                <el-form-item label="用户名：" prop="username" class="input-style">
                    <el-input  v-model="ruleForm.username" size="middle" clearable></el-input>
                </el-form-item>

                <el-form-item label="密码：" prop="password" class="input-style">
                    <el-input v-model="ruleForm.password" type="password" show-password clearable></el-input>
                </el-form-item>

                <el-form-item label="真实姓名：" prop="realname" class="input-style">
                    <el-input  v-model="ruleForm.realname" size="middle" clearable></el-input>
                </el-form-item>

                <el-form-item label="电话：" prop="phone" class="input-style">
                    <el-input  v-model="ruleForm.phone" size="middle" clearable></el-input>
                </el-form-item>

                <el-form-item label="性别：" prop="sex">
                    <el-radio-group v-model="ruleForm.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="出生日期：" required >
                    <el-col :span="6">
                        <el-form-item prop="birthDay">
                            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.birthDay" style="width: 100%;" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="等级：" prop="rank">
                    <el-select v-model="ruleForm.rank" placeholder="请选择管理员等级">
                        <el-option label="普通管理员" value="1"></el-option>
                        <el-option label="超级管理员" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态：" prop="state">
                    <el-switch
                        v-model="ruleForm.state"
                        active-text="正常"
                        inactive-text="冻结">
                    </el-switch>
                </el-form-item>

                <el-form-item style="margin-top: 50px;align-items: center">
                    <el-button type="primary" @click="submitForm('ruleForm')">添加</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>

</template>

<script>
    export default {
        name: "AddAdmin",
        data() {
            return {
                ruleForm: {
                    username:'',
                    password:'',
                    realname:'',
                    phone:'',
                    sex:'',
                    birthDay:'',
                    state:true,
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                rules: {
                    username: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { pattern: /^(\w){8,20}$/, message: '只能输入8-20个字母、数字、下划线' , trigger: 'blur'}
                    ],
                    realname: [ { required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                    phone : [
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
                    sex: [ { required: true, message: '请选择性别', trigger: 'change' } ],
                    birthDay: [ { type: 'date', required: true, message: '请选择日期', trigger: 'change' } ],
                    rank: [{ required: true, message: '请选择管理员等级', trigger: 'change' }]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
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
        display: inline-block;
        margin-right: 50px;
    }
</style>

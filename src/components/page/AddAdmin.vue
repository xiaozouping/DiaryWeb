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
                        <el-radio label="0">男</el-radio>
                        <el-radio label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="出生日期：" required>
                    <el-col :span="6">
                        <el-form-item prop="birthDay">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="ruleForm.birth_day"
                                style="width: 100%;"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="等级：" prop="admin_rank">
                    <el-select v-model="ruleForm.admin_rank" placeholder="请选择管理员等级">
                        <el-option label="普通管理员" value="1"></el-option>
                        <el-option label="超级管理员" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态：" prop="admin_state">
                    <el-switch
                        v-model="ruleForm.admin_state"
                        active-text="正常"
                        :active-value="'0'"
                        inactive-text="冻结"
                        :inactive-value="'2'"
                    ></el-switch>
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
                //出生日期不得晚于今天
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
                    birth_day: [ { type: 'date', required: true, message: '请选择日期', trigger: 'change' } ],
                    admin_rank: [{ required: true, message: '请选择管理员等级', trigger: 'change' }]
                }
            };
        },
        methods: {
            submitForm(formName) {
                const _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(_this.ruleForm)
                        // alert('submit!');
                        _this.$axios.post('http://localhost:8181/admin/save',this.ruleForm).then(function (resp) {
                            // console.log(resp.data)
                            if (resp.data == 'success'){
                                // _this.$alert('为您跳转至管理员信息！', '添加成功', {
                                //     confirmButtonText: '确定',
                                //     callback: action => {
                                //
                                //     }
                                // })
                                _this.$message("添加成功！")
                                _this.$router.push('/adminmanage')
                            }
                        })
                    } else {
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

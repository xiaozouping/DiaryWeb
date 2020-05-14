<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-s-custom"></i> 管理员管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container" >
            <div class="handle-box">
                <el-button type="primary" class="handle-del mr10" @click="toAddAdmin">新建</el-button>
                <el-button type="primary" class="handle-del mr10" @click="delAllSelection" :disabled="multipleSelection.length === 0">批量删除</el-button>
                <el-button type="primary" class="handle-del mr10" @click="cancelSelection">取消选择</el-button>

                <el-input v-model="username" placeholder="用户名" class="handle-input mr10" clearable></el-input>
                <el-input v-model="realname" placeholder="真实姓名" class="handle-input mr10" clearable></el-input>

                <el-select v-model="admin_state" placeholder="状态" class="handle-select mr10" clearable>
                    <el-option key="1" label="正常" value="0"></el-option>
                    <el-option key="2" label="无效" value="1"></el-option>
                    <el-option key="3" label="冻结" value="2"></el-option>
                </el-select>

                <el-select v-model="admin_rank" placeholder="等级" class="handle-select mr10" clearable>
                    <el-option key="1" label="普通管理员" value="1"></el-option>
                    <el-option key="2" label="超级管理员" value="0"></el-option>
                </el-select>

                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>

            <!-- 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。-->
            <el-table
                :data="tableData"
                border
                height="430px"
                class="table"
                ref="multipleTable"
                v-loading="loading"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!--              复选框-->
                <el-table-column type="selection" width="55" align="center" :selectable='selectTrue'></el-table-column>
                <!--              ID-->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>

                <el-table-column prop="username" label="用户名" align="center"></el-table-column>

                <el-table-column prop="realname" label="真实姓名" align="center"></el-table-column>

                <el-table-column label="性别" width="55px" align="center" >
                    <template slot-scope="scope">
                        {{scope.row.sex==0?'男':'女'}}
                    </template>
                </el-table-column>

                <el-table-column prop="birth_day" label="出生日期" align="center"></el-table-column>

                <el-table-column prop="phone" label="电话" align="center"></el-table-column>

                <el-table-column prop="create_time" label="创建时间" width="160px" align="center"></el-table-column>


                <el-table-column label="状态" align="center" width="90px">
                    <template slot-scope="scope">
                        <!--                        标签样式-->
                        <el-tag
                            :type="scope.row.admin_state==0?'success':(scope.row.admin_state=='2'?'danger':'info')"
                        >{{scope.row.admin_state==0?'正常':(scope.row.admin_state=='2'?'冻结':'无效')}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="等级" align="center" width="110px">
                    <template slot-scope="scope">
                        {{scope.row.admin_rank==0?'超级管理员':'普通管理员'}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150px" align="center" fixed="right" >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            class="blue"
                            @click="handleEdit(scope.row)"
                            :disabled="scope.row.admin_state == '1'"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.row)"
                            :disabled="scope.row.admin_state == '1'"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--            分页-->
            <!--            <div class="pagination">-->
            <!--                &lt;!&ndash;@current-change点击绑定按钮&ndash;&gt;-->
            <!--                <el-pagination-->
            <!--                    background-->
            <!--                    layout="total, prev, pager, next"-->
            <!--                    :current-page="pagination.page"-->
            <!--                    :page-size="pagination.size"-->
            <!--                    :total="pagination.total"-->
            <!--                    @current-change="handlePageChange"-->
            <!--                ></el-pagination>-->
            <!--            </div>-->
        </div>

        <!-- 修改弹出框 -->
        <el-dialog title="修改" :visible.sync="editVisible" width="60%">

            <el-form ref="form" :model="form" :rules="rules" label-width="100px" >

                <el-form-item label="用户名：" class="input-style">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="密码：" class="input-style" prop="password">
                    <el-input v-model="form.password" type="password" clearable></el-input>
                </el-form-item>

                <el-form-item label="真实姓名：" class="input-style">
                    <el-input  v-model="form.realname" size="middle" disabled></el-input>
                </el-form-item>

                <el-form-item label="电话：" class="input-style" prop="phone">
                    <el-input  v-model="form.phone" size="middle" clearable></el-input>
                </el-form-item>

                <el-form-item label="性别：">
                    <el-radio-group v-model="form.sex">
                        <el-radio label="0" disabled>男</el-radio>
                        <el-radio label="1" disabled>女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="出生日期：" >
                    <el-col :span="6">
                        <el-form-item >
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.birth_day" style="width: 100%;" disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="等级：">
                    <el-select v-model="form.admin_rank" >
                        <el-option label="普通管理员" value="1"></el-option>
                        <el-option label="超级管理员" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态：">
                    <el-switch
                        v-model="form.admin_state"
                        active-text="正常"
                        :active-value="'0'"
                        inactive-text="冻结"
                        :inactive-value="'2'"
                    ></el-switch>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'AdminManage',
        data() {
            return {
                tableData: [
                    {
                        id:1,
                        username:'zhangsan',
                        realname: '张三',
                        sex:'男',
                        birthDay:'1997-12-21',
                        phone:123456789,
                        createTime:20200004,
                        state: '正常',
                        rank:'超级管理员'
                    },
                    {
                        id:2,
                        username:'lisi',
                        realname: '李四',
                        sex:'女',
                        birthDay:'1997-12-21',
                        phone:125463256,
                        createTime:20200004,
                        state: '失效',
                        rank:'普通管理员'
                    },
                    {
                        id:3,
                        username:'wangwu',
                        realname: '王五',
                        sex:'男',
                        birthDay:'1997-12-21',
                        phone:185454125,
                        createTime:20200004,
                        state: '冻结',
                        rank:'普通管理员'
                    },
                    {
                        id:4,
                        username:'qianliu',
                        realname: '钱六',
                        sex:'男',
                        birthDay:'1997-12-21',
                        phone:18545654125,
                        createTime:20200004,
                        state: '正常',
                        rank:'超级管理员'
                    },
                    {
                        id:5,
                        username:'lisi11',
                        realname: '李四sdsds',
                        sex:'女',
                        birthDay:'1997-12-21',
                        phone:125463256,
                        createTime:20200004,
                        state: '失效',
                        rank:'普通管理员'
                    },
                    {
                        id:6,
                        username:'zoup',
                        realname: '邹萍',
                        sex:'女',
                        birthDay:'1997-12-26',
                        phone:125463256,
                        createTime:20200004,
                        state: '正常',
                        rank:'超级管理员'
                    }

                ],
                loading: true,
                rules: {
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
                editVisible: false,  //弹框显示初始状态

                //查询条件
                username:null,
                realname:null,
                admin_state:null,
                admin_rank:null,

                //初始分页条件
                pagination: {
                    page: 1,
                    size: 10,
                    total: 0,
                },

                //多选框数组
                multipleSelection: [],
                delarr: '', //存放删除的数据

                form: {},
                idx: -1,  //选中信息的id
                id: -1,

            };
        },
        created() {
            // window.location.reload()
            const _this = this
            _this.$axios.get('http://localhost:8181/admin/getadmin').then(function (resp) {
                // console.log(resp.data)
                _this.tableData = resp.data
                _this.loading = false
            })

        },
        watch:{
            $route(){
                window.location.reload();
            }
        },
        methods: {
            // 跳转到添加页面
            toAddAdmin(){
                this.$router.push('/addadmin')
            },

            //失效帐号不可选
            selectTrue(row, column){
                if(row.admin_state == "1"){
                    return false  //不可勾选
                }else{
                    return true  //可勾选
                }
            },

            // 条件查询
            handleSearch() {
                // console.log(this.username);
                // console.log(this.realname);
                // console.log(this.admin_state);
                // console.log(this.admin_rank);
                const _this = this;
                if(!_this.admin_state){
                    _this.admin_state=null;
                }
                if(!_this.admin_rank){
                    _this.admin_rank=null;
                }
                _this.$axios.get("http://localhost:8181/admin/searchadmin",{
                    params: {
                        username: _this.username,
                        realname:_this.realname,
                        admin_state:_this.admin_state,
                        admin_rank:_this.admin_rank
                    }
                }).then(function (result) {
                    console.log(result.data)
                    _this.tableData = result.data

                }).catch(function (error) {
                    console.log(error)
                })
            },

            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除"'+row.username+'"吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        const _this = this
                        _this.$axios.put('http://localhost:8181/admin/deleteById/'+row.id).then(function(resp){
                            console.log(resp)
                            _this.$alert('已删除成功！', '消息', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    window.location.reload()
                                }
                            })
                        })
                    })
                    .catch(() => {});
            },

            // 多选操作
            handleSelectionChange(val) {
                // console.log(val);
                this.multipleSelection = val;
            },
            //批量删除
            delAllSelection() {

                const _this = this;

                let ids = '';
                this.multipleSelection.forEach(selectedItem => {
                    // 删除请求
                    ids += selectedItem.id + ',';
                });
                let params = {
                    ids: ids
                };
                console.log(this.ids);
                _this.$confirm('此操作将批量删除管理员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$axios.post('http://localhost:8181/admin/deleteAll', {},{params: params})
                        .then(resp => {
                            // console.log(resp);
                            if (resp.data == 1){
                                _this.$alert('已删除成功！', '消息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        window.location.reload()
                                    }
                                })
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: '部分内容删除失败！'
                                })
                            }
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            //取消选择
            cancelSelection(){
                this.$refs.multipleTable.clearSelection();
            },

            // 点击修改，跳出弹窗,显示数据
            handleEdit(row) {
                const _this = this
                _this.$axios.get('http://localhost:8181/admin/findById/'+row.id).then(function(resp){
                    // console.log(resp.data)
                    _this.form = resp.data[0]
                })
                this.editVisible = true;
            },
            // 保存修改，更新数据到数据库
            saveEdit(formName) {
                this.editVisible = false;

                const _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid){
                        console.log(_this.form)
                        _this.$axios.put('http://localhost:8181/admin/updateById',this.form).then(function(resp){
                            if(resp.data == '1'){
                                _this.$message({message:"修改成功！",type:"success"})
                                window.location.reload()
                            }
                            else {
                                _this.$message({message:"修改失败！",type:"error"})
                            }
                        })
                    }
                    else {
                        return false;
                    }
                });
            },

            // 分页导航
            handlePageChange(currentPage) {
                // alert(currentPage);
                const _this = this
                _this.$axios.get('http://localhost:8181/admin/findAll/'+(currentPage-1)+'/4').then(function (resp) {
                    console.log(resp)
                    _this.tableData = resp.data.content
                    _this.pageSize = resp.data.size
                    _this.pageTotal = resp.data.totalElements
                })
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .blue{
        color: #409eff;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .input-style{
        width: 350px;
        display: inline-block;
        margin-right: 30px;
        margin-left: 20px;
    }
</style>

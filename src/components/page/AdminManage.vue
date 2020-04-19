<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 管理员管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>

                <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-input v-model="query.realname" placeholder="真实姓名" class="handle-input mr10"></el-input>

                <el-select v-model="query.state" placeholder="状态" class="handle-select mr10">
                    <el-option key="1" label="正常" value="正常"></el-option>
                    <el-option key="2" label="无效" value="无效"></el-option>
                    <el-option key="3" label="冻结" value="冻结"></el-option>
                </el-select>

                <el-select v-model="query.rank" placeholder="等级" class="handle-select mr10">
                    <el-option key="1" label="普通管理员" value="普通管理员"></el-option>
                    <el-option key="2" label="超级管理员" value="超级管理员"></el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </div>

            <!-- 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。-->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"

                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
<!--              复选框-->
                <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--              ID-->
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>

                <el-table-column prop="username" label="用户名" align="center"></el-table-column>

                <el-table-column prop="realname" label="真实姓名" align="center"></el-table-column>

                <el-table-column prop="sex" label="性别" width="70" align="center"></el-table-column>

                <el-table-column prop="birth_day" label="出生日期" align="center"></el-table-column>

                <el-table-column prop="phone" label="电话" align="center"></el-table-column>

                <el-table-column prop="create_time" label="创建时间"></el-table-column>



                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
<!--                        标签样式-->
                        <el-tag
                            :type="scope.row.state==='正常'?'success':(scope.row.state==='冻结'?'danger':'info')"
                        >{{scope.row.state}}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="rank" label="等级" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >修改</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            分页-->
            <div class="pagination">
<!--                @current-change点击绑定按钮-->
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 修改弹出框 -->
        <el-dialog title="修改" :visible.sync="editVisible" width="60%">

            <el-form ref="form" :model="form" label-width="100px" :rules="rules">

                <el-form-item label="用户名" class="input-style">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="密码：" class="input-style">
                    <el-input v-model="form.password" type="password" show-password clearable></el-input>
                </el-form-item>

                <el-form-item label="真实姓名：" class="input-style">
                    <el-input  v-model="form.realname" size="middle" disabled></el-input>
                </el-form-item>

                <el-form-item label="电话：" class="input-style">
                    <el-input  v-model="form.phone" size="middle" clearable></el-input>
                </el-form-item>

                <el-form-item label="性别：" >
                    <el-radio-group v-model="form.sex">
                        <el-radio label="男" disabled></el-radio>
                        <el-radio label="女" disabled></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="出生日期：" required >
                    <el-col :span="6">
                        <el-form-item prop="birth_day">
                            <el-date-picker type="date" placeholder="选择日期" v-model="form.birthDay" style="width: 100%;" disabled></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item label="等级：" >
                    <el-select v-model="form.rank" placeholder="请选择管理员等级">
                        <el-option label="普通管理员" value="普通管理员"></el-option>
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态：">
                    <el-switch
                        v-model="form.state"
                        active-text="正常"
                        inactive-text="冻结">
                    </el-switch>
                </el-form-item>



            </el-form>



            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'AdminManage',
    data() {
        return {
            query: {
                username: '',
                realname: '',
                state: '',
                rank:'',
                pageIndex: 1,
                pageSize: 10
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            },
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
                }

            ],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        const _this = this
        this.$axios.get('http://localhost:8181/admin/findAll/1/3').then(function (resp) {
            console.log(resp)
            _this.tableData = resp.data.content
            _this.pageSize = resp.data.size
            _this.total = resp.data.totalElements
        })
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchData(this.query).then(res => {
                console.log(res);
                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 修改
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 修改
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
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
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
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

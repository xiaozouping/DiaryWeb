<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量发货</el-button>

                <el-select v-model="state" placeholder="订单状态" class="handle-select mr10">
                    <el-option key="1" label="待发货" value="0"></el-option>
                    <el-option key="2" label="已发货" value="1"></el-option>
                    <el-option key="3" label="已收货" value="2"></el-option>
                    <el-option key="3" label="已取消" value="3"></el-option>
                    <el-option key="3" label="待付款" value="4"></el-option>
                </el-select>

                <el-input v-model="orderNo" placeholder="订单编号" class="handle-input mr10"></el-input>
                <el-input v-model="userPhone" placeholder="电话" class="handle-input mr10"></el-input>

                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>

            <!-- 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。-->
            <el-table
                :data="tableData"
                border
                height="400px"
                class="table"
                ref="multipleTable"
                v-loading="loading"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!--              复选框-->
                <el-table-column type="selection" width="55" align="center" :selectable='selectTrue'></el-table-column>
                <!--              ID-->
                <el-table-column prop="orderId" label="ID" width="55" align="center"></el-table-column>

                <el-table-column prop="orderNo" label="订单编号" align="center"></el-table-column>

                <el-table-column prop="goodsName" label="作品名称" align="center"></el-table-column>

                <el-table-column prop="orderStatus" label="订单状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.orderStatus==0?'待发货':(scope.row.orderStatus==1?'待收货':(scope.row.orderStatus==2?'已完成':(scope.row.orderStatus==3?'已取消':'待付款')))}}
                    </template>
                </el-table-column>

                <el-table-column prop="totalPrice" label="金额" align="center"></el-table-column>

                <el-table-column prop="userName" label="收件人" align="center"></el-table-column>

                <el-table-column prop="userPhone" label="电话" align="center"></el-table-column>

                <el-table-column prop="createTime" label="下单时间" align="center" :formatter="formatDate" width="150px"></el-table-column>


                <el-table-column label="操作" width="250px" align="center" fixed="right" >
                    <template slot-scope="scope">
                        <el-button
                            type="danger"
                            @click="handleEdit(scope.row)"
                            :disabled="scope.row.admin_state == '1'"
                            size="small"
                        >发货</el-button>
                        <el-button
                            type="success"
                            @click="handleDelete(scope.row)"
                            :disabled="scope.row.admin_state == '1'"
                            size="small"
                        >下载</el-button>
                        <el-button
                            type="info"
                            @click="handleEdit(scope.row)"
                            :disabled="scope.row.admin_state == '1'"
                            size="small"
                        >取消订单</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--            分页-->
            <div class="pagination">
                <!--                @current-change点击绑定按钮-->

                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    export default {
        name: 'OrderManage',
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
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageIndex: 1,   //页面起始位置
                pageSize: '',
                pageTotal: '',
                form: {},
                idx: -1,  //选中信息的id
                id: -1
            };
        },
        created() {
            // window.location.reload()
            const _this = this
            _this.$axios.get('http://localhost:8181/ordermessage/getorder').then(function (resp) {
                // console.log(resp)
                _this.tableData = resp.data

                // _this.pageSize = resp.data.size
                // _this.pageTotal = resp.data.totalElements
            })
        },
        methods: {

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

            // 触发搜索按钮
            handleSearch() {
                // this.$set(this.query, 'pageIndex', 1);
                // this.getData();
            },

            //创建时间显示格式
            formatDate(row, column) {
                // 获取单元格数据
                if (row.createTime==''){
                    return ''
                }
                var time = new Date(row.createTime);
                return time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
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
                        _this.$axios.put('http://localhost:8181/admin/updateById/'+_this.form.id,_this.form).then(function(resp){
                            if(resp.data == '1'){
                                _this.$message("修改成功！")
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
                // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                // this.$set(this.tableData, this.idx, this.form);
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

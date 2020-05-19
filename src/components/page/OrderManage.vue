<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-document"></i> 订单信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="handle-del mr10" @click="deliveryAllOrder" :disabled="multipleSelection.length === 0">批量发货</el-button>
                <el-button type="primary" class="handle-del mr10" @click="cancelSelection">取消选择</el-button>

                <el-select v-model="orderStatus" placeholder="订单状态" class="handle-select mr10" clearable>
                    <el-option key="1" label="待发货" value="0"></el-option>
                    <el-option key="2" label="已发货" value="1"></el-option>
                    <el-option key="3" label="已完成" value="2"></el-option>
                    <el-option key="4" label="已取消" value="3"></el-option>
                    <el-option key="5" label="待付款" value="4"></el-option>
                </el-select>

                <el-input v-model="orderNo" placeholder="订单编号" class="handle-input mr10" clearable></el-input>
                <el-input v-model="userPhone" placeholder="电话" class="handle-input mr10" clearable></el-input>

                <el-button type="primary" @click="handleSearch">查询</el-button>
            </div>

            <!-- 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。-->
            <el-table
                :data="tableData"
                border
                height="430px"
                class="table"
                ref="multipleTable"
                :row-style="{height:'30px'}"
                :cell-style="{padding:'4px 0'}"
                v-loading="loading"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!--              复选框-->
                <el-table-column type="selection" width="55" align="center" :selectable='selectTrue'></el-table-column>
                <!--              ID-->
                <el-table-column prop="orderId" label="ID" width="55" align="center"></el-table-column>

                <el-table-column prop="orderNo" label="订单编号" align="center" width="130px">
                    <template slot-scope="scope">
                        <div style="color:#409eff;text-decoration:underline;cursor:pointer;" @click="handleDetail(scope.row)">{{ scope.row.orderNo }}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="works_title" label="作品名称" align="center"width="200px">
                    <template slot-scope="scope">
                        《 {{scope.row.works_title}} 》
                    </template>
                </el-table-column>

                <el-table-column prop="orderStatus" label="订单状态" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.orderStatus==0?'danger':(scope.row.orderStatus==1?'':(scope.row.orderStatus==2?'success':(scope.row.orderStatus==3?'info':'warning')))"
                        >{{scope.row.orderStatus==0?'待发货':(scope.row.orderStatus==1?'已发货':(scope.row.orderStatus==2?'已完成':(scope.row.orderStatus==3?'已取消':'待付款')))}}</el-tag>

                    </template>
                </el-table-column>

                <el-table-column prop="totalPrice" label="总金额" align="center" width="70px">
                    <template slot-scope="scope">
                        ￥ {{scope.row.totalPrice}}
                    </template>
                </el-table-column>

                <el-table-column prop="userName" label="收件人" align="center" width="120px"></el-table-column>

                <el-table-column prop="userPhone" label="电话" align="center" width="120px"></el-table-column>

                <el-table-column prop="deliveryName" label="快递名称" align="center" width="120px">
                    <template slot-scope="scope">
                        {{scope.row.deliveryName==0?'圆通快递':'顺丰快递'}}
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" width="160px"></el-table-column>


                <el-table-column label="操作" width="250px" align="center" fixed="right" >
                    <template slot-scope="scope">
                        <el-button
                            type="danger"
                            @click="handleDelivery(scope.row)"
                            :disabled="scope.row.orderStatus != '0'"
                            size="small"
                        >发货</el-button>
                        <el-button
                            type="success"
                            @click="handleDownload(scope.row)"
                            :disabled="scope.row.orderStatus == '3' || scope.row.orderStatus == '4'"
                            size="small"
                        >下载</el-button>
                        <el-button
                            type="info"
                            @click="handleCancel(scope.row)"
                            :disabled="!(scope.row.orderStatus == '0'|| scope.row.orderStatus == '4')"
                            size="small"
                        >取消订单</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <!--@current-change点击绑定按钮-->
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="pagination.page"
                    :page-size="pagination.size"
                    :total="pagination.total"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 订单详情弹出框 -->
        <el-dialog title="订单详情" :visible.sync="editVisible" width="60%">

            <el-form ref="form" :model="form"  label-width="100px" >

                <el-form-item label="订单ID：" class="input-style">
                    {{form.orderId}}
                </el-form-item>

                <el-form-item label="订单编号：" class="input-style" style="font-weight: bold;">
                    {{form.orderNo}}
                </el-form-item>

                <el-form-item label="交易状态：" class="input-style1" style="color:#1aad19;font-weight: bold;">
                    {{form.orderStatus==0?'待发货':(form.orderStatus==1?'已发货':(form.orderStatus==2?'已完成':(form.orderStatus==3?'已取消':'待付款')))}}
                </el-form-item>

                <el-form-item label="作品名称：" class="input-style">
                    《 {{form.works_title}} 》
                </el-form-item>

                <el-form-item label="订购数量：" class="input-style">
                    {{form.goodsNum}}
                </el-form-item>

                <el-form-item label="作品页数：" class="input-style1">
                    {{form.worksPage}} 页
                </el-form-item>

                <el-form-item label="快递名称：" class="input-style">
                    {{form.deliveryName==0?'圆通快递':'顺丰快递'}}
                </el-form-item>

                <el-form-item label="快递金额：" class="input-style">
                    ￥ {{form.deliveryPrice}}
                </el-form-item>

                <el-form-item label="作品价格：" class="input-style">
                    ￥ {{form.worksPrice}}
                </el-form-item>

                <el-form-item label="合计：" class="input-style" style="color:#f0a732;font-weight: bold;">
                    ￥ {{form.totalPrice}}
                </el-form-item>

                <el-form-item label="收件人ID：" class="input-style">
                    {{form.userId}}
                </el-form-item>

                <el-form-item label="收件人：" class="input-style">
                    {{form.userName}}
                </el-form-item>

                <el-form-item label="收件电话：" class="input-style">
                    {{form.userPhone}}
                </el-form-item>

                <el-form-item label="收货地址：" class="input-style">
                    {{form.userAddress}}
                </el-form-item>

                <el-form-item label="创建时间：" class="input-style">
                    {{form.createTime}}
                </el-form-item>

                <el-form-item label="发货时间：" class="input-style">
                    {{form.deliveryTime}}
                </el-form-item>

                <el-form-item label="收货时间：" class="input-style">
                    {{form.receiveTime}}
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">关 闭</el-button>
            </span>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        inject:['reload'],  //注入依赖
        name: 'OrderManage',
        data() {
            return {
                loading: true,
                tableData: [],
                multipleSelection: [],
                editVisible: false,

                //查询条件
                orderStatus:'',
                orderNo:'',
                userPhone:'',

                //初始分页条件
                pagination: {
                    page: 1,
                    size: 7,
                    total: 0,
                    pageSize:7,
                    currentPage:1
                },
                form: {}
            };
        },
        created() {
            this.getList(this.pagination.page);
        },
        methods: {
            //失效帐号不可选
            selectTrue(row, column){
                if(row.orderStatus == "0"){
                    return true  //不可勾选
                }else{
                    return false  //可勾选
                }
            },

            // 触发搜索按钮
            handleSearch() {
                this.loading = true
                this.getList(this.pagination.page);
            },

            // 发货操作
            handleDelivery(row) {
                console.log(row)
                // 二次确认发货
                this.$confirm('确定要发货吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        const _this = this
                        _this.$axios.put('http://localhost:8181/orders/deliveryorder/'+row.orderId).then(function(resp){
                            console.log(resp)
                            if (resp.data==1){
                                _this.$alert('发货成功！', '消息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        _this.reload()
                                    }
                                })
                            }
                            else {
                                _this.$message({message:"发货失败！",type:"error"})
                            }
                        })
                    })
                    .catch(() => {});
            },

            //下载作品
            handleDownload(row){
                // console.log(row);

                window.open("http://localhost:8181/chapter/exportExcel/"+row.userId+"/"+row.works_title,"_parent");

            },

            // 取消操作
            handleCancel(row) {
                console.log(row)
                // 二次确认取消订单
                this.$confirm('确定要取消订单吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        const _this = this
                        _this.$axios.put('http://localhost:8181/orders/cancelorder/'+row.orderId).then(function(resp){
                            console.log(resp)
                            if (resp.data==1){
                                _this.$message({message:"取消成功！",type:"success"})
                                _this.reload()

                            }
                            else {
                                _this.$message({message:"发货失败！",type:"error"})
                            }
                        })
                    })
                    .catch(() => {});
            },

            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //批量发货
            deliveryAllOrder() {

                const _this = this;
                const length = this.multipleSelection.length;

                let ids = '';
                this.multipleSelection.forEach(selectedItem => {
                    // 发货请求
                    ids += selectedItem.orderId + ',';
                });
                let params = {
                    ids: ids
                };
                console.log(this.ids);
                _this.$confirm('此操作将批量发货, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$axios.post('http://localhost:8181/orders/deliveryAll', {},{params: params})
                        .then(resp => {
                            console.log(resp);
                            if (resp.data == 1){
                                _this.$alert('已发货成功！', '消息', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        _this.reload()
                                    }
                                })
                            }
                            else {
                                this.$message({
                                    type: 'error',
                                    message: '部分订单发货失败！'
                                })
                            }
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发货'
                    })
                })
            },

            //取消选择
            cancelSelection(){
                this.$refs.multipleTable.clearSelection();
            },

            // 点击修改，跳出弹窗,显示数据
            handleDetail(row) {
                const _this = this
                console.log(row)
                this.form = row

                this.editVisible = true;
            },


            // 分页导航
            handlePageChange(currentPage) {
                // alert(currentPage);
                this.loading = true
                this.getList(currentPage);
            },

            getList(nowpage){
                const _this = this
                _this.$axios.get("http://localhost:8181/orders/getorder",{
                    params: {
                        orderStatus: _this.orderStatus,
                        orderNo:_this.orderNo,
                        userPhone:_this.userPhone,
                        currentPage:nowpage,
                        pageSize:_this.pagination.pageSize
                    }
                }).then(function (result) {
                    console.log(result.data)
                    _this.tableData = result.data.list;
                    _this.pagination.total = result.data.total
                    _this.loading = false

                }).catch(function (error) {
                    console.log(error)
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
        width: 220px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .mr10 {
        margin-right: 10px;
    }
    .input-style{
        border: 1px solid #eeeeee;
        width: 350px;
        display: inline-block;
        /*margin-right: 20px;*/
        margin-left: 50px;
        margin-bottom: 10px;
        border-radius: 7px;
    }
    .input-style1{
        border: 1px solid #eeeeee;
        width: 350px;
        /*margin-right: 20px;*/
        margin-left: 50px;
        font-size: 13px;
        margin-bottom: 10px;
        border-radius: 7px;
    }
    .pagination{
        margin-bottom: 0;
    }
</style>

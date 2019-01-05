<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="87%">
            <el-table-column
                    label="报错日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="报错内容"
                    min-width="200">
            </el-table-column>
            <el-table-column
                    label="状态"
                    width="67">
                <template slot-scope="scope">
                    {{scope.row.isDeal ? '已处理' : '未处理'}}
                </template>
            </el-table-column>
            <el-table-column
                    label="处理日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.dealTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dealContent"
                    label="处理内容"
                    min-width="200">
            </el-table-column>
            <el-table-column
                    label="处理账户"
                    width="90">
                <template slot-scope="scope">
                    {{scope.row.userSite ? scope.row.userSite.username : ''}}
                </template>
            </el-table-column>
            <el-table-column
                    label="订单详情"
                    width="80">
                <template slot-scope="scope">
                    <el-popover
                            @show="loadOrderInfo(scope.row)"
                            placement="left"
                            trigger="click">
                        <div class="error-order-info">
                            <span class="title">订单类型: </span> <span>{{scope.row.order.name}}</span>
                        </div>
                        <div class="error-order-info">
                            <span class="title">下单日期: </span> <span>{{scope.row.order.createTime}}</span>
                        </div>
                        <div class="error-order-info">
                            <span class="title">表单内容: </span>
                            <div v-for="(item, key) in scope.row.order.fields">
                                <div v-if="key.search('file') !== -1">
                                    {{item.name}}: <img style="width: 100px; height: 100px;" :src="item.value" :alt="item.name"/>
                                </div>
                                <div v-else>
                                    <span>{{item.name}}: </span>
                                    <input style="display: inline-block; width: 50px;" v-model="item.value"/>
                                    <el-tooltip effect="dark" placement="top" :content="item.value">
                                        <el-button type="primary" size="mini"
                                                   v-clipboard:copy="item.value"
                                                   v-clipboard:success="onCopy"
                                                   v-clipboard:error="onCopyError">复制</el-button>
                                    </el-tooltip>
                                </div>
                            </div>
                        </div>
                        <div class="error-order-info"><span class="title">单价: </span> <span>{{scope.row.order.price}}</span></div>
                        <div class="error-order-info"><span class="title">数量: </span> <span>{{scope.row.order.num}}</span></div>
                        <div class="error-order-info"><span class="title">总价: </span> <span>{{scope.row.order.totalPrice}}</span></div>
                        <div class="error-order-info"><span class="title">初始量: </span> <span>{{scope.row.order.startNum}}</span></div>
                        <div class="error-order-info"><span class="title">执行进度: </span> <span>{{countOrderProgress(scope.row.order)}}%</span></div>
                        <div class="error-order-info"><span class="title">已执行: </span> <span>{{scope.row.order.executeNum}}</span></div>
                        <div class="error-order-info">
                            <span class="title">返利: </span>
                            <div v-for="item in scope.row.order.profits">
                                {{item.name}}: ￥{{item.profit}}
                            </div>
                            <div>
                                订单成本: ￥{{scope.row.order.baseFunds}}
                            </div>
                        </div>
                        <div class="error-order-info"><span class="title">状态: </span> <span>{{scope.row.order.status}}</span></div>
                        <div class="error-order-info"><span class="title">撤单信息: </span> <span>{{scope.row.order.refundMsg}}</span></div>

                        <el-button size="small" slot="reference">详情</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope"  v-if="canDeal && !scope.row.isDeal">
                    <el-button-group>
                        <el-button type="primary" size="small" @click="dealError(scope.row)">处 理</el-button>
                        <el-button v-if="scope.row.order.status !== '已结算' && scope.row.order.status !== '已撤销'"
                                   type="danger" size="small"
                                   @click="openRefundDialog(scope.row)">撤 单</el-button>
                        <el-button v-if="scope.row.order.status === '执行中' || scope.row.order.status === '排队中' || scope.row.order.status === '待结算'"
                                   type="success" size="small"
                                   @click="openAccountOrder(scope.row)">结 算</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="text-align: center;"
                :pager-count="5"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20, 25, 30, 35, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTotal">
        </el-pagination>

        <el-dialog title="处理订单报错" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" label-width="60px">
                <el-form-item label="内容" prop="dealContent">
                    <el-input type="textarea"
                              :autosize="{ minRows: 2, maxRows: 10}"
                              v-model.trim="dialog.dealContent"
                              placeholder="请输入处理内容！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="撤销订单" :visible.sync="refundVisible" top="3vh" width="30%" @closed="cancelRefund">
            <el-form :model="refundDialog" :rules="refundRules" ref="refundDialog" label-width="100px">
                <el-form-item label="执行数量" prop="executeNum">
                    <el-input-number v-model="refundDialog.executeNum" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="退单信息" prop="refundMsg">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            v-model.trim="refundDialog.refundMsg">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="refundVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="refund">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="订单结算" :visible.sync="accountVisible" top="3vh" width="30%" @closed="cancelAccount">
            <el-form :model="account" :rules="accountRules" ref="account" label-width="60px">
                <el-form-item label="内容" prop="dealContent">
                    <el-input type="textarea"
                              :autosize="{ minRows: 2, maxRows: 10}"
                              v-model.trim="account.dealContent"
                              placeholder="请输入处理内容！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="accountVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="accountOrder">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost, countOrderProgress} from "@/utils";
    import Vue from 'vue';
    import VueClipboard from 'vue-clipboard2';

    Vue.use(VueClipboard);

    export default {
        name: "OrderError",
        async created() {
            await this.getTableData();
            this.$options.sockets[this.siteId + 'addOrderError'] = (error) => {
                if (this.magProducts.includes(error.productId)) {
                    this.tableData.unshift(error);
                }
            };
            this.$options.sockets[this.siteId + 'dealOrderError'] = (error) => {
                let aim = this.tableData.find(item => {
                    return item.id === error.id;
                });
                aim.isDeal = error.isDeal ;
                aim.dealContent = error.dealContent ;
                aim.dealTime = error.dealTime ;
                aim.userSite = error.userSite ;
                aim.order = error.order;
            };
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogVisible: false,
                dialog: {
                    dealContent: ''
                },
                dialogRules: {
                    dealContent: [
                        {required: true, message: '请输入处理内容！', trigger: 'blur'},
                        {max: 160, message: '备注内容不能超过160个字符！', trigger: 'blur'}
                    ]
                },
                refundVisible: false,
                refundDialog: {
                    executeNum: 0,
                    refundMsg: ''
                },
                refundRules: {
                    executeNum: [
                        {required: true, message: '请输入订单当前已执行数量!', trigger: 'blur'},
                        {validator: (rule, value, callback) =>{
                                let orderNum = this.refundDialog.order.num;
                                if (value > orderNum) {
                                    callback(new Error('订单执行数量不能大于下单数量!'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur'},
                    ],
                    refundMsg: [
                        {required: true, message: '请输入退单信息!', trigger: 'blur'},
                        {max: 120, message: '内容不能超过120个字符!', trigger: 'blur'},
                    ]
                },
                accountVisible: false,
                account: {
                    dealContent: ''
                },
                accountRules: {
                    dealContent: [
                        {required: true, message: '请输入处理内容！', trigger: 'blur'},
                        {max: 160, message: '内容不能超过160个字符！', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            onCopy(e) {
                e.trigger.style.backgroundColor = '#f56c6c';
                e.trigger.style.borderColor = '#f56c6c';
                this.$message({
                    type: 'success',
                    message: '复制成功!',
                    duration: 600
                });
            },
            onCopyError(e) {
                this.$message({
                    type: 'error',
                    message: '复制失败!',
                    duration: 600
                });
            },
            tableRowClassName({row}) {
                return row.isDeal ? 'already-deal' : 'wait_deal';
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/site/auth/all/order/errors?currentPage=' +
                    this.currentPage + '&pageSize=' + this.pageSize);
                this.tableData = datas;
                this.dataTotal = total;
            },
            async handleSizeChange(size) {
                this.pageSize = size;
                await this.getTableData();
            },
            async handleCurrentChange(page) {
                this.currentPage = page;
                await this.getTableData();
            },
            async loadOrderInfo(error) {
                error.order = await axiosGet(`/site/auth/get/order/info/of/${error.order.id}`);
            },
            countOrderProgress(order) {
                return countOrderProgress(order);
            },
            dealError(error) {
                this.dialog = {
                    dealContent: '',
                    error: error
                };
                this.dialogVisible = true;
            },
            cancelDialog() {
                this.dialog = {
                    dealContent: ''
                };
                this.$refs.dialog.resetFields();
            },
            submit() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let info = this.dialog;
                            let oldError = info.error;
                            await axiosPost('/site/auth/order/deal/error', {
                                id: oldError.id,
                                dealContent: info.dealContent
                            });
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('订单报错已经处理了,请勿重复处理!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            cancelRefund() {
                this.refundDialog = {
                    executeNum: 0,
                    refundMsg: ''
                };
                this.$refs.refundDialog.resetFields();
            },
            openRefundDialog(error) {
                this.refundDialog.errorId = error.id;
                this.refundDialog.order = error.order;
                this.refundVisible = true;
            },
            async refund() {
                this.$refs.refundDialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.refundDialog.isCommitted) {
                            this.refundDialog.isCommitted = true;
                            let info = this.refundDialog;
                            await axiosPost('/site/auth/deal/error/order/refund', {
                                errorId: info.errorId,
                                orderId: info.order.id,
                                executeNum: info.executeNum,
                                refundMsg: info.refundMsg
                            });
                            this.refundVisible = false;
                        }else{
                            this.$message.error('订单报错已经处理了,请勿重复处理!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            cancelAccount() {
                this.account = {
                    dealContent: ''
                };
                this.$refs.account.resetFields();
            },
            openAccountOrder(error) {
                this.account.errorId = error.id;
                this.account.order = error.order;
                this.accountVisible = true;
            },
            accountOrder() {
                this.$refs.account.validate(async (valid) => {
                    if (valid) {
                        if (!this.account.isCommitted) {
                            this.account.isCommitted = true;
                            let info = this.account;
                            await axiosPost('/site/auth/deal/error/order/account', {
                                errorId: info.errorId,
                                orderId: info.order.id,
                                dealContent: info.dealContent
                            });
                            this.accountVisible = false;
                        }else{
                            this.$message.error('订单报错已经处理了,请勿重复处理!');
                        }
                    } else {
                        return false;
                    }
                });
            },
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            },
            magProducts() {
                return this.$store.state.magProducts;
            },
            canDeal() {
                return this.$store.state.permissions.some(item => {
                    return item === 'dealOrderErrorSite';
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-table .already-deal {
        background: #F0F9EB;
    }

    .el-table .wait_deal {
        background: #FDF5E6;
    }
    .error-order-info{
        margin-bottom: 6px;
        .title{
            font-size: medium;
            font-weight: bold;
        }
    }
</style>
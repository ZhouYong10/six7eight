<template>
    <div style="height: 100%">
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="87%">
            <el-table-column
                    label="下单日期"
                    :show-overflow-tooltip="true"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="表单内容"
                    min-width="80">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="click">
                        <div v-for="(item, key) in scope.row.fields">
                            <p v-if="key.search('file') !== -1">
                                {{item.name}}: <img style="width: 100px; height: 100px;" :src="item.value" :alt="item.name"/>
                            </p>
                            <p v-else>
                                <span>{{item.name}}: </span>
                                <input style="display: inline-block; width: 50px;" v-model="item.value"/>
                                <el-tooltip effect="dark" placement="top" :content="item.value">
                                    <el-button type="primary" size="mini"
                                               v-clipboard:copy="item.value"
                                               v-clipboard:success="onCopy"
                                               v-clipboard:error="onCopyError">复制</el-button>
                                </el-tooltip>
                            </p>
                        </div>
                        <el-button size="small" slot="reference">内容</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="单价"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="totalPrice"
                    label="总价"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="startNum"
                    label="初始量"
                    min-width="70">
            </el-table-column>
            <el-table-column
                    label="执行进度"
                    min-width="76">
                <template slot-scope="scope">
                    {{countOrderProgress(scope.row)}}%
                </template>
            </el-table-column>
            <el-table-column
                    prop="executeNum"
                    label="已执行"
                    min-width="70">
            </el-table-column>
            <el-table-column
                    label="返利"
                    min-width="70">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="click">
                        <div v-for="item in scope.row.profits">
                            {{item.name}}: ￥{{item.profit}}
                        </div>
                        <div>
                            订单成本: ￥{{scope.row.baseFunds}}
                        </div>
                        <el-button size="small" slot="reference">详情</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
                    min-width="66">
            </el-table-column>
            <el-table-column
                    prop="refundMsg"
                    label="撤单信息"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button v-if="scope.row.status === '待执行'"
                                   type="primary" size="small"
                                   @click="openExecuteDialog(scope.row)">执 行</el-button>
                        <el-button v-if="scope.row.status !== '已结算' && scope.row.status !== '已撤销'"
                                   type="danger" size="small"
                                   @click="openRefundDialog(scope.row)">撤 单</el-button>
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

        <el-dialog title="执行订单" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" label-width="100px">
                <el-form-item label="执行初始量" prop="startNum">
                    <el-input-number v-model="dialog.startNum" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="排队时间" prop="queueTime">
                    <el-select v-model="dialog.queueTime" placeholder="请选择">
                        <el-option key="0" label="0 小时" :value="0"></el-option>
                        <el-option key="1" label="1 小时" :value="1"></el-option>
                        <el-option key="2" label="2 小时" :value="2"></el-option>
                        <el-option key="3" label="3 小时" :value="3"></el-option>
                        <el-option key="4" label="4 小时" :value="4"></el-option>
                        <el-option key="5" label="5 小时" :value="5"></el-option>
                        <el-option key="6" label="6 小时" :value="6"></el-option>
                        <el-option key="7" label="7 小时" :value="7"></el-option>
                        <el-option key="8" label="8 小时" :value="8"></el-option>
                        <el-option key="9" label="9 小时" :value="9"></el-option>
                        <el-option key="10" label="10 小时" :value="10"></el-option>
                        <el-option key="11" label="11 小时" :value="11"></el-option>
                        <el-option key="12" label="12 小时" :value="12"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="execute">确 定</el-button>
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
    </div>
</template>

<script>
    import {axiosGet, axiosPost, countOrderProgress} from "@/utils";
    import Vue from 'vue';
    import VueClipboard from 'vue-clipboard2';

    Vue.use(VueClipboard);

    export default {
        name: "DealProduct",
        props: ['id'],
        async created() {
            await this.getTableData();
        },
        watch: {
            id: async function(val){
                this.id = val;
                this.currentPage = 1;
                this.pageSize = 10;
                this.dataTotal = 0;
                await this.getTableData();
            }
        },
        sockets: {
            addOrder(data) {
                if (this.id === data.productId) {
                    this.tableData.unshift(data.order);
                }
            },
            executeOrder(data) {
                if (this.id === data.productId) {
                    let aim = this.tableData.find(item => {
                        return item.id === data.order.id;
                    });
                    aim.startNum = data.order.startNum;
                    aim.status = data.order.status;
                    aim.queueTime = data.order.queueTime;
                    aim.dealTime = data.order.dealTime;
                }
            },
            refundOrder(data) {
                if (this.id === data.productId) {
                    let aim = this.tableData.find(item => {
                        return item.id === data.order.id;
                    });
                    aim.status = data.order.status;
                    aim.executeNum = data.order.executeNum;
                    aim.refundMsg = data.order.refundMsg;
                    aim.finishTime = data.order.finishTime;
                    aim.profits = data.order.profits;
                    aim.realTotalPrice = data.order.realTotalPrice;
                    aim.baseFunds = data.order.baseFunds;
                }
            }
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogVisible: false,
                dialog: {
                    startNum: 0,
                    queueTime: 0,
                },
                dialogRules: {
                    startNum: [
                        {required: true, message: '请输入订单执行初始量!', trigger: 'blur'}
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
                switch (row.status){
                    case '待执行':
                        return 'order_wait';
                    case '执行中':
                        return 'order_execute';
                    case '排队中':
                        return 'order_queue';
                    case '待结算':
                        return 'order_account';
                    case '已结算':
                        return 'order_finish';
                    case '已撤销':
                        return 'order_refund';
                }
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/platform/auth/orders/' + this.id + '?currentPage=' +
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
            countOrderProgress(order) {
                return countOrderProgress(order);
            },
            cancelDialog() {
                this.dialog = {
                    startNum: 0,
                    queueTime: 0,
                };
                this.$refs.dialog.resetFields();
            },
            cancelRefund() {
                this.refundDialog = {
                    executeNum: 0,
                    refundMsg: ''
                };
                this.$refs.refundDialog.resetFields();
            },
            openExecuteDialog(order) {
                this.dialog.id = order.id;
                this.dialogVisible = true;
            },
            async execute() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            await axiosPost('/platform/auth/order/execute', this.dialog);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('订单已经处理了,请勿重复处理!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            openRefundDialog(order) {
                this.refundDialog.order = order;
                this.refundVisible = true;
            },
            async refund() {
                this.$refs.refundDialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.refundDialog.isCommitted) {
                            this.refundDialog.isCommitted = true;
                            let info = this.refundDialog;
                            await axiosPost('/platform/auth/order/refund', {
                                id: info.order.id,
                                executeNum: info.executeNum,
                                refundMsg: info.refundMsg
                            });
                            this.refundVisible = false;
                        }else{
                            this.$message.error('订单已经处理了,请勿重复处理!');
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
    }
</script>

<style lang="scss">
    .el-table .order_execute {
        background: #dff9d8;
    }

    .el-table .order_queue {
        background: #d6eef7;
    }

    .el-table .order_account {
        background: #f6e4fb;
    }

    .el-table .order_wait {
        background: #FDF5E6;
    }

    .el-table .order_refund {
        background: #ffe3e3;
    }
</style>
<template>
    <div style="height: 100%">
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="下单日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="表单内容"
                    min-width="80">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            width="500"
                            trigger="click">
                        <div v-for="(item, key) in scope.row.fields">
                            <p v-if="key.search('file') !== -1">
                                {{item.name}}: <img style="width: 100px; height: 100px;" :src="item.value" :alt="item.name"/>
                            </p>
                            <p v-else>
                                {{item.name}}: {{item.value}}
                            </p>
                        </div>
                        <el-button slot="reference">表单内容</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="单价"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    min-width="50">
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
                    min-width="90">
                <template slot-scope="scope">
                    {{countOrderProgress(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column
                    label="返利"
                    min-width="90">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="click">
                        <div v-for="item in scope.row.profits">
                            {{item.name}}: ￥{{item.profit}}
                        </div>
                        <div>
                            订单成本: ￥{{scope.row.basePrice}}
                        </div>
                        <el-button slot="reference">详情</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 'order_wait'">待执行</span>
                    <span v-if="scope.row.status === 'order_execute'">执行中</span>
                    <span v-if="scope.row.status === 'order_finish'">已完成</span>
                    <span v-if="scope.row.status === 'order_refund'">已退款</span>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="155">
                <template slot-scope="scope" v-if="scope.row.type === 'type_site'">
                    <el-button v-if="scope.row.status === 'order_wait'"
                               type="primary" plain size="small"
                               @click="openExecuteDialog(scope.row)">执 行</el-button>
                    <el-button  v-if="scope.row.status !== 'order_finish'"
                                type="danger" plain size="small"
                                @click="openRefundDialog(scope.row)">退 款</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="执行订单" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" label-width="100px">
                <el-form-item label="执行初始量" prop="startNum">
                    <el-input-number v-model="dialog.startNum" :min="0" :controls="false"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="execute">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="撤销订单" :visible.sync="refundVisible" top="3vh" width="30%" @closed="cancelRefund">
            <el-form :model="refundDialog" ref="refundDialog" label-width="100px">
                <el-form-item label="执行数量" prop="executeNum">
                    <el-input-number v-model="refundDialog.executeNum" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="退单信息" prop="refundMsg">
                    <el-input
                            type="textarea"
                            :rows="3"
                            v-model="refundDialog.refundMsg">
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

    export default {
        name: "DealProduct",
        props: ['id'],
        async created() {
            this.changeTableData(this.id);
            this.$options.sockets[this.siteId + 'addOrder'] = (data) => {
                if (this.id === data.productId) {
                    this.tableData.unshift(data.order);
                }
            };
            this.$options.sockets[this.siteId + 'executeOrder'] = (data) => {
                if (this.id === data.productId) {
                    let aim = this.tableData.find(item => {
                        return item.id === data.order.id;
                    });
                    aim.startNum = data.order.startNum;
                    aim.status = data.order.status;
                    aim.dealTime = data.order.dealTime;
                }
            };
            this.$options.sockets[this.siteId + 'refundOrder'] = (data) => {
                if (this.id === data.productId) {
                    let aim = this.tableData.find(item => {
                        return item.id === data.order.id;
                    });
                    aim.status = data.order.status;
                    aim.executeNum = data.order.executeNum;
                    aim.refundMsg = data.order.refundMsg;
                    aim.finishTime = data.order.finishTime;
                }
            };
        },
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                dialog: {
                    startNum: 0
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
            }
        },
        watch: {
            id: function(val){
                this.changeTableData(val);
            }
        },
        methods: {
            async changeTableData(productId) {
                this.tableData = await axiosGet('/site/auth/orders/' + productId);
            },
            tableRowClassName({row}) {
                switch (row.status){
                    case 'order_wait':
                        return 'order_wait';
                    case 'order_execute':
                        return 'order_execute';
                    case 'order_finish':
                        return 'order_finish';
                    case 'order_refund':
                        return 'order_refund';
                }
            },
            countOrderProgress(order) {
                return countOrderProgress(order);
            },
            cancelDialog() {
                this.dialog = {
                    startNum: 0
                };
                this.$refs.dialog.resetFields();
            },
            cancelRefund() {
                this.refundDialog = {
                    executeNum: 0
                };
                this.$refs.refundDialog.resetFields();
            },
            openExecuteDialog(order) {
                this.dialog.id = order.id;
                this.dialogVisible = true;
            },
            async execute() {
                await axiosPost('/site/auth/order/execute', this.dialog);
                this.dialogVisible = false;
            },
            openRefundDialog(order) {
                this.refundDialog.id = order.id;
                this.refundVisible = true;
            },
            async refund() {

            }
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            }
        }
    }
</script>

<style lang="scss">
    .el-table .order_execute {
        background: #F0F9EB;
    }

    .el-table .order_wait {
        background: #FDF5E6;
    }

    .el-table .order_refund {
        background: #FEF0F0;
    }
</style>
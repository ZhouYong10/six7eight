<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="87%">
            <el-table-column
                    label="类型"
                    min-width="68">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            min-width="60"
                            trigger="click">
                        <p class="site-desc">所属分站: {{ scope.row.site.name }}</p>
                        <p class="site-desc">提交日期: {{ scope.row.createTime }}</p>
                        <p class="site-desc">处理日期: {{ scope.row.dealTime }}</p>
                        <el-button size="small" slot="reference">{{scope.row.type === 'site_withdraw' ? '站点' : '用户'}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="提现账户"
                    min-width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.user ? scope.row.user.username : scope.row.userSite.username}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="支付宝账户"
                    min-width="70">
                <template slot-scope="scope">
                    <input style="display: inline-block; width: 50px;" v-model="scope.row.alipayCount"/>
                    <el-tooltip effect="dark" placement="top" :content="scope.row.alipayCount">
                        <el-button type="primary" size="mini"
                                   v-clipboard:copy="scope.row.alipayCount"
                                   v-clipboard:success="onCopy"
                                   v-clipboard:error="onCopyError">复制</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                    label="支付宝实名"
                    min-width="70">
                <template slot-scope="scope">
                    <input style="display: inline-block; width: 50px;" v-model="scope.row.alipayName"/>
                    <el-tooltip effect="dark" placement="top" :content="scope.row.alipayName">
                        <el-button type="primary" size="mini"
                                   v-clipboard:copy="scope.row.alipayName"
                                   v-clipboard:success="onCopy"
                                   v-clipboard:error="onCopyError">复制</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="66">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'wait_withdraw'">待提现</span>
                    <span v-else-if="scope.row.state === 'success_withdraw'">已到账</span>
                    <span v-else="scope.row.state === 'fail_withdraw'">失败</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="oldFunds"
                    label="之前余额"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="funds"
                    label="提现金额"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="newFunds"
                    label="之后余额"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="failMsg"
                    label="失败信息"
                    :show-overflow-tooltip="true"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button-group v-if="scope.row.state === 'wait_withdraw'">
                        <el-button v-if="canWithdraw"
                                   type="primary" size="small"
                                   @click="withdrawHand(scope.row)">提 现</el-button>
                        <el-button v-if="canFail"
                                   type="danger" size="small"
                                   @click="failHand(scope.row)">失 败</el-button>
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

        <el-dialog title="提现失败" :visible.sync="failVisible" top="3vh" width="30%" @closed="cancelFail">
            <el-form :model="fail" :rules="failRules" ref="failForm" label-width="80px">
                <el-form-item label="失败信息" prop="failMsg">
                    <el-input type="textarea"
                              :autosize="{ minRows: 2, maxRows: 10}"
                              v-model.trim="fail.failMsg"
                              placeholder="请输入提现失败信息！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="failVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitFail">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";
    import Vue from 'vue';
    import VueClipboard from 'vue-clipboard2';

    Vue.use(VueClipboard);

    export default {
        name: "Withdraws",
        async created() {
            await this.getTableData();
        },
        sockets: {
            platformWithdrawAdd(withdraw) {
                this.tableData.unshift(withdraw);
            },
            platformWithdrawDeal(withdraw) {
                let aim = this.tableData.find(item => {
                    return item.id === withdraw.id;
                });
                aim.dealTime = withdraw.dealTime;
                aim.state = withdraw.state;
                aim.failMsg = withdraw.failMsg;
            }
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                failVisible: false,
                fail: {
                    failMsg: ''
                },
                failRules: {
                    failMsg: [
                        { required: true, message: '请输入提现失败信息！', trigger: 'blur'}
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
                switch (row.state){
                    case 'wait_withdraw':
                        return 'wait_withdraw';
                    case 'success_withdraw':
                        return 'success_withdraw';
                    default:
                        return 'fail_withdraw';
                }
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/platform/auth/withdraw/records?currentPage=' +
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
            cancelFail() {
                this.fail = {failMsg: ''};
                this.$refs.failForm.resetFields();
            },
            async withdrawHand(withdraw) {
                this.$confirm('是否确认提现！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/hand/withdraw/' + withdraw.id);
                }).catch((e) => {
                    console.log(e);
                });
            },
            failHand(withdraw) {
                this.fail.id = withdraw.id;
                this.fail.withdraw = withdraw;
                this.failVisible = true;
            },
            submitFail() {
                this.$refs.failForm.validate(async (valid) => {
                    if (valid) {
                        if (!this.fail.isCommitted) {
                            this.fail.isCommitted = true;
                            await axiosPost('/platform/auth/hand/withdraw/fail', {
                                id: this.fail.id,
                                failMsg: this.fail.failMsg
                            });
                            this.failVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            canWithdraw() {
                return this.$store.state.permissions.some(item => {
                    return item === 'withdrawSuccessPlatform';
                });
            },
            canFail() {
                return this.$store.state.permissions.some(item => {
                    return item === 'withdrawFailPlatform';
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-table .success_withdraw {
        background: #F0F9EB;
    }

    .el-table .wait_withdraw {
        background: #FDF5E6;
    }

    .el-table .fail_withdraw {
        background: #FEF0F0;
    }
</style>
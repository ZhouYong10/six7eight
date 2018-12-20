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
                            width="300"
                            trigger="hover">
                        <p class="site-desc">所属分站: {{ scope.row.site.name }}</p>
                        <p class="site-desc">提交日期: {{ scope.row.createTime }}</p>
                        <p class="site-desc">处理日期: {{ scope.row.intoAccountTime }}</p>
                        <el-button size="small" slot="reference">{{scope.row.type === 'site_recharge' ? '站点' : '用户'}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="充值账户"
                    min-width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.user ? scope.row.user.username : scope.row.userSite.username}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="交易号"
                    min-width="70">
                <template slot-scope="scope">
                    <input style="display: inline-block; width: 50px;" v-model="scope.row.alipayId"/>
                    <el-tooltip effect="dark" placement="top" :content="scope.row.alipayId">
                        <el-button type="primary" size="mini"
                                   v-clipboard:copy="scope.row.alipayId"
                                   v-clipboard:success="onCopy"
                                   v-clipboard:error="onCopyError">复制</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="66">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'wait_recharge'">待充值</span>
                    <span v-else-if="scope.row.state === 'success_recharge'">已到账</span>
                    <span v-else="scope.row.state === 'fail_recharge'">失败</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="oldFunds"
                    label="之前余额"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="funds"
                    label="充值金额"
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
                    <el-button-group v-if="scope.row.state === 'wait_recharge'">
                        <el-button v-if="canRecharge"
                                   type="primary" size="small"
                                   @click="rechargeHand(scope.row)">充 值</el-button>
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

        <el-dialog title="手动充值" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="120px">
                <el-form-item label="充值金额" prop="funds">
                    <el-input-number v-model="dialog.funds" :min="0" :controls="false"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="充值失败" :visible.sync="failVisible" top="3vh" width="30%" @closed="cancelFail">
            <el-form :model="fail" :rules="failRules" ref="failForm" label-width="80px">
                <el-form-item label="失败信息" prop="failMsg">
                    <el-input type="textarea"
                              :autosize="{ minRows: 2, maxRows: 10}"
                              v-model.trim="fail.failMsg"
                              placeholder="请输入充值失败信息！"></el-input>
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
        name: "Recharges",
        async created() {
            await this.getTableData();
        },
        sockets: {
            platformRechargeAdd(recharge) {
                this.tableData.unshift(recharge);
            },
            platformRechargeDeal(recharge) {
                let aim = this.tableData.find(item => {
                    return item.id === recharge.id;
                });
                aim.intoAccountTime = recharge.intoAccountTime;
                aim.state = recharge.state;
                aim.oldFunds = recharge.oldFunds;
                aim.funds = recharge.funds;
                aim.newFunds = recharge.newFunds;
            },
            platformRechargeFail(recharge) {
                let aim = this.tableData.find(item => {
                    return item.id === recharge.id;
                });
                aim.state = recharge.state;
                aim.failMsg = recharge.failMsg;
                aim.intoAccountTime = recharge.intoAccountTime;
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
                    funds: ''
                },
                dialogRules: {
                    funds: [
                        { required: true, message: '请输入充值金额！', trigger: 'blur' },
                    ]
                },
                failVisible: false,
                fail: {
                    failMsg: ''
                },
                failRules: {
                    failMsg: [
                        { required: true, message: '请输入充值失败信息！', trigger: 'blur'}
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
                    case 'wait_recharge':
                        return 'wait_recharge';
                    case 'success_recharge':
                        return 'success_recharge';
                    default:
                        return 'fail_recharge';
                }
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/platform/auth/recharge/records?currentPage=' +
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
            cancelDialog() {
                this.dialog = {
                    funds: ''
                };
                this.$refs.dialogForm.resetFields();
            },
            cancelFail() {
                this.fail = {failMsg: ''};
                this.$refs.failForm.resetFields();
            },
            rechargeHand(recharge) {
                this.dialog.id = recharge.id;
                this.dialog.recharge = recharge;
                this.dialogVisible = true;
            },
            submitForm() {
                this.$refs.dialogForm.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/platform/auth/hand/recharge', {
                            id: this.dialog.id,
                            funds: this.dialog.funds
                        });
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            failHand(recharge) {
                this.fail.id = recharge.id;
                this.fail.recharge = recharge;
                this.failVisible = true;
            },
            submitFail() {
                this.$refs.failForm.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/platform/auth/hand/recharge/fail', {
                            id: this.fail.id,
                            failMsg: this.fail.failMsg
                        });
                        this.failVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            canRecharge() {
                return this.$store.state.permissions.some(item => {
                    return item === 'rechargeSuccessPlatform';
                });
            },
            canFail() {
                return this.$store.state.permissions.some(item => {
                    return item === 'rechargeFailPlatform';
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-table .success_recharge {
        background: #F0F9EB;
    }

    .el-table .wait_recharge {
        background: #FDF5E6;
    }

    .el-table .fail_recharge {
        background: #FEF0F0;
    }
</style>
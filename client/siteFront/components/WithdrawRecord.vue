<template>
    <div style="height: 100%">
        <el-button v-if="canWithdraw"
                   size="medium" style="margin: 0 6px 6px;"
                   type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">立即提现</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="82%">
            <el-table-column
                    label="申请日期"
                    :show-overflow-tooltip="true"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="到账日期"
                    :show-overflow-tooltip="true"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.dealTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="支付宝账户"
                    min-width="100">
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
                    min-width="100">
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
                    label="状态"
                    min-width="70">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'wait_withdraw'">提现中</span>
                    <span v-else-if="scope.row.state === 'success_withdraw'">已到账</span>
                    <span v-else="scope.row.state === 'fail_withdraw'">失败</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="failMsg"
                    label="失败信息"
                    :show-overflow-tooltip="true"
                    min-width="120">
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

        <el-dialog title="申请提现" :visible.sync="dialogVisible" top="3vh" width="70%" @close="cancelDialog">
            <el-row>
                <el-col :span="24">
                    <sf-reminder title="提示">
                        1、提现金额不能小于10元。<br>
                        2、平台用户提现支付宝必须和充值支付宝一致，否则平台不受理（投手提现不受此限制）。<br>
                        3、提现支付宝昵称请填实名（个别支付宝用户需要实名验证，敬请谅解），否则支付宝无法转账。<br>
                        <span class="tip">注: 提现将在1至2个工作日内到账。</span>
                    </sf-reminder>
                </el-col>
                <el-col :span="24">
                    <el-form ref="form" :model="form" :rules="formRules" label-width="110px">
                        <el-form-item label="支付宝账户" prop="alipayCount">
                            <el-input v-model.trim="form.alipayCount" placeholder="请务必核对准确"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝实名" prop="alipayName">
                            <el-input v-model.trim="form.alipayName" placeholder="请务必核对准确"></el-input>
                        </el-form-item>
                        <el-form-item label="提现金额" prop="funds">
                            <el-input-number v-model="form.funds" :min="0" :controls="false"></el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="reset">重置</el-button>
                            <el-button type="primary" @click="submit">确认提现</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";
    import Vue from 'vue';
    import VueClipboard from 'vue-clipboard2';

    Vue.use(VueClipboard);

    export default {
        name: "WithdrawRecord",
        async beforeRouteUpdate (to, from, next) {
            await this.getTableData(to.query.aimId);
            next();
        },
        async created() {
            await this.getTableData(this.$route.query.aimId);
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogVisible: false,
                form: {
                    alipayCount: '',
                    alipayName: '',
                    funds: ''
                },
                formRules: {
                    alipayCount: [
                        {required: true, message: '请输入提现支付宝账户！', trigger: 'blur'}
                    ],
                    alipayName: [
                        {required: true, message: '请输入提现支付宝账户实名！', trigger: 'blur'}
                    ],
                    funds: [
                        {required: true, message: '请输入提现金额！', trigger: 'blur'},
                        {validator: async (rule, value, callback) => {
                                let data = await axiosGet('/user/auth/get/withdraw/min/and/user/funds');
                                if (data) {
                                    let userState = data.userState;
                                    let minWithdraw = parseFloat(data.minWithdraw);
                                    let userFunds = parseFloat(data.userFunds);
                                    if (userState === '正常') {
                                        if (value < minWithdraw) {
                                            callback(new Error('最少' + minWithdraw + '元起提！'));
                                        } else {
                                            if (value > userFunds) {
                                                callback(new Error('账户可提现金额不足，当前可提现金额为：' + userFunds + '元！'));
                                            } else {
                                                callback();
                                            }
                                        }
                                    } else {
                                        callback(new Error('您的账户已被' + userState + ',无法提现!'))
                                    }
                                } else {
                                    callback(new Error('请登录后操作!'));
                                }
                            }, trigger: 'blur'},
                    ],
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
            async getTableData(aimId) {
                if (aimId) {
                    let aimWithdraw = await axiosGet(`/user/auth/withdraw/${aimId}`);
                    this.tableData = [aimWithdraw];
                    this.dataTotal = 1;
                }else{
                    let [datas, total] = await axiosGet('/user/auth/withdraw/records?currentPage=' +
                        this.currentPage + '&pageSize=' + this.pageSize);
                    this.tableData = datas;
                    this.dataTotal = total;
                }
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
                this.reset();
            },
            reset() {
                this.form = {
                    alipayCount: '',
                    alipayName: '',
                    funds: ''
                };
                this.$refs.form.resetFields();
            },
            submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        if (!this.form.isCommitted) {
                            this.form.isCommitted = true;
                            let data = await axiosPost('/user/auth/withdraw/add', this.form);
                            if (data) {
                                this.tableData.unshift(data.withdraw);
                                this.$store.commit('changeFundsAndFreezeFunds', {
                                    funds: data.withdraw.newFunds,
                                    freezeFunds: data.freezeFunds
                                });
                                this.dialogVisible = false;
                            }
                        }else{
                            this.$message.error('提现申请已经提交了,请勿重复提交!');
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
                    return item === 'addWithdrawUser';
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
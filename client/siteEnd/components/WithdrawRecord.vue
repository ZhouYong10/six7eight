<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col>
                <el-button v-if="canWithdraw" type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">立即提现</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    prop="userSite.username"
                    label="提现账户"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="提交日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="处理日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.dealTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="alipayCount"
                    label="支付宝账户"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="alipayName"
                    label="支付宝实名"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="oldFunds"
                    label="之前余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="funds"
                    label="提现金额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="newFunds"
                    label="之后余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="80">
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
                    min-width="80">
            </el-table-column>
        </el-table>

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
                            <el-input v-model="form.alipayCount" placeholder="请务必核对准确"></el-input>
                        </el-form-item>
                        <el-form-item label="支付宝实名" prop="alipayName">
                            <el-input v-model="form.alipayName" placeholder="请务必核对准确"></el-input>
                        </el-form-item>
                        <el-form-item label="提现金额" prop="funds">
                            <el-input-number v-model="form.funds" :min="10" :controls="false"></el-input-number>
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
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "WithdrawRecord",
        async created() {
            this.tableData = await axiosGet('/site/auth/withdraw/records');
        },
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                userFunds: '',
                form: {
                    alipayCount: '',
                    alipayName: '',
                    funds: ''
                },
                formRules: {
                    alipayCount: [
                        {required: true, message: '请输入支付宝账户！', trigger: 'blur'}
                    ],
                    alipayName: [
                        {required: true, message: '请输入支付宝账户实名！', trigger: 'blur'}
                    ],
                    funds: [
                        {required: true, message: '请输入提现金额！', trigger: 'blur'},
                        {validator: async (rule, value, callback) => {
                                if (value < 10) {
                                    callback(new Error('最少10元起提！'))
                                }else {
                                    if (!this.userFunds) {
                                        this.userFunds = await axiosGet('/user/auth/user/funds');
                                    }
                                    if (value > parseFloat(this.userFunds)) {
                                        callback(new Error('账户可提现金额不足，当前可提现金额为：' + this.userFunds + '元！'));
                                    } else {
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'},
                    ],
                }
            }
        },
        methods: {
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
            cancelDialog() {
                this.reset();
            },
            reset() {
                this.$refs.form.resetFields();
            },
            submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let withdraw = await axiosPost('/user/auth/withdraw/add', this.form);
                        this.tableData.unshift(withdraw);
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            canWithdraw() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addWithdrawSite';
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
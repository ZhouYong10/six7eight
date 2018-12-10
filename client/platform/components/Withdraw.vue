<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="提现类型"
                    min-width="80">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            width="300"
                            trigger="click">
                        <p class="site-desc">所属分站: {{ scope.row.site.name }}</p>
                        <p class="site-desc">提交日期: {{ scope.row.createTime }}</p>
                        <p class="site-desc">处理日期: {{ scope.row.dealTime }}</p>
                        <el-button slot="reference">{{scope.row.type === 'site_withdraw' ? '站点' : '用户'}}</el-button>
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
                    prop="alipayCount"
                    label="支付宝账户"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="alipayName"
                    label="支付宝实名"
                    min-width="100">
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
                    <span v-if="scope.row.state === 'wait_withdraw'">待提现</span>
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
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'wait_withdraw'">
                        <el-button v-if="canWithdraw" type="primary" plain icon="el-icon-edit"
                                   size="small" @click="withdrawHand(scope.row)">提现</el-button>
                        <el-button v-if="canFail" type="danger" plain icon="el-icon-edit"
                                   size="small" @click="failHand(scope.row)">失败</el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="提现失败" :visible.sync="failVisible" top="3vh" width="30%" @closed="cancelFail">
            <el-form :model="fail" :rules="failRules" ref="failForm" label-width="80px">
                <el-form-item label="失败信息" prop="failMsg">
                    <el-input type="textarea" :rows="3" v-model="fail.failMsg" placeholder="请输入提现失败信息！"></el-input>
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
    import {isNum} from "@/validaters";

    export default {
        name: "Withdraws",
        async created() {
            this.tableData = await axiosGet('/platform/auth/withdraw/records');
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
                        await axiosPost('/platform/auth/hand/withdraw/fail', {
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
<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="充值类型"
                    min-width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.type === 'site_recharge' ? '站点充值' : '用户充值'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="site.name"
                    label="所属分站"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="充值账户"
                    min-width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.user ? scope.row.user.username : scope.row.userSite.username}}</span>
                </template>
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
                    label="到账日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.intoAccountTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="alipayCount"
                    label="支付宝"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="alipayId"
                    label="交易号"
                    min-width="280">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'wait_recharge'">待充值</span>
                    <span v-else-if="scope.row.state === 'success_recharge'">已到账</span>
                    <span v-else="scope.row.state === 'fail_recharge'">失败</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="oldFunds"
                    label="之前余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="funds"
                    label="充值金额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="newFunds"
                    label="之后余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="88">
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.isDone" type="primary" plain icon="el-icon-edit"
                               size="small" @click="rechargeHand(scope.row)">充值</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="手动充值" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" label-width="120px">
                <el-form-item label="支付宝账户" prop="alipayCount">
                    <el-input v-model="dialog.alipayCount"></el-input>
                </el-form-item>
                <el-form-item label="充值金额" prop="funds">
                    <el-input v-model="dialog.funds"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";
    import {isNum} from "@/validaters";

    export default {
        name: "Recharges",
        async created() {
            this.tableData = await axiosGet('/platform/auth/recharge/records');
        },
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                dialog: {
                    alipayCount: '',
                    funds: ''
                },
                dialogRules: {
                    alipayCount: [
                        { required: true, message: '请输入支付宝账户名！', trigger: 'blur'}

                    ],
                    funds: [
                        { required: true, message: '请输入充值金额！', trigger: 'blur' },
                        { validator: (rule, value, callback)=>{
                                if (!isNum(value)) {
                                    callback(new Error('充值金额必须为数字！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
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
            cancelDialog() {
                this.dialog = {
                    alipayCount: '',
                    funds: ''
                }
            },
            rechargeHand(recharge) {
                this.dialog.id = recharge.id;
                this.dialog.recharge = recharge;
                this.dialogVisible = true;
            },
            submitForm() {
                this.$refs.dialogForm.validate(async (valid) => {
                    if (valid) {
                        let recharge = await axiosPost('/platform/auth/hand/recharge', {
                            id: this.dialog.id,
                            alipayCount: this.dialog.alipayCount,
                            funds: this.dialog.funds
                        });
                        let oldRecharge = this.dialog.recharge;
                        oldRecharge.intoAccountTime = recharge.intoAccountTime;
                        oldRecharge.alipayCount = recharge.alipayCount;
                        oldRecharge.state = recharge.state;
                        oldRecharge.oldFunds = recharge.oldFunds;
                        oldRecharge.funds = recharge.funds;
                        oldRecharge.newFunds = recharge.newFunds;
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
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
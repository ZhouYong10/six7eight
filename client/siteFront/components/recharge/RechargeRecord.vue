<template>
    <div style="height: 100%">
        <el-button v-if="canRecharge"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">立即充值</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="82%">
            <el-table-column
                    label="充值时间"
                    :show-overflow-tooltip="true"
                    min-width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="到账时间"
                    :show-overflow-tooltip="true"
                    min-width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.intoAccountTime}}</span>
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
                    min-width="70">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'wait_recharge'">充值中</span>
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
                    label="失败原因"
                    :show-overflow-tooltip="true"
                    min-width="100">
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

        <el-dialog title="在线充值" :visible.sync="dialogVisible" top="3vh" width="70%" @close="cancelDialog">
            <el-row>
                <el-col :span="24">
                    <sf-reminder title="提示">
                        <el-row>
                            <el-col :sm="24" :lg="14">
                                <span class="tip">方式一【扫码充值】：</span><br>
                                1、通过扫码充值，付款金额为您需要充值的金额。<br>
                                2、付款说明，转账付款时请在备注中填写要充值的账户名： <span class="tip" style="font-size: 23px;">{{username ? username : '账户名'}}</span><br>
                                3、如付款备注账号错误或未备注充值账号，会导致扫码自动充值失败，此情况请使用方式二充值。<br><br>

                                <span class="tip">方式二【交易号充值】：</span><br>
                                1、请优先使用方式一充值，如方式一充值失败，可提交交易号充值。 <br>
                                2、转账完成后，点击付款页面的“查看详情”，记录下 32 位的交易号。<br>
                                3、输入交易号，稍等 30 秒即可自动入账。<br>
                                4、如果提示交易号仍无法充值，请提交问题反馈。<br>
                                <span class="tip">注意： 此方式交易号当天有效（晚上十二点之前），第二天提交会自动过期。</span>
                            </el-col>
                            <el-col :sm="24" :lg="10">
                                <img class="am-radius" src="./recharge_code.png" alt="扫码充值" height="280">
                            </el-col>
                        </el-row>
                    </sf-reminder>
                </el-col>
                <el-col :span="24">
                    <el-form ref="dialog" :model="dialog" :rules="dialogRules" label-width="110px">
                        <el-form-item label="支付宝交易号" prop="alipayId">
                            <el-input v-model.trim="dialog.alipayId"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submit">立即充值</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";
    import {isNum} from "@/validaters";
    import * as moment from "moment";
    import Vue from 'vue';
    import VueClipboard from 'vue-clipboard2';

    Vue.use(VueClipboard);

    export default {
        name: "RechargeRecord",
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
                rechargeCode: '',
                dialog: {
                    alipayId: ''
                },
                dialogRules: {
                    alipayId: [
                        {required: true, message: '请输入支付宝充值交易号！', trigger: 'blur'},
                        {
                            validator: async (rule, value, callback) => {
                                if (value.length !== 32 || !isNum(value)) {
                                    callback(new Error('请输入32位数字支付宝充值交易号！'));
                                } else if (value.substr(0, 8) < moment().format('YYYYMMDD')) {
                                    callback(new Error('该交易号已经过期！'));
                                } else {
                                    let recharge = await axiosPost('/user/auth/alipayId/exist', {alipayId: value});
                                    if (recharge) {
                                        callback(new Error('该交易号已提交，请勿重复提交！'));
                                    } else {
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'
                        }
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
            async getTableData(aimId) {
                if (aimId) {
                    let aimRecharge = await axiosGet(`/user/auth/recharge/${aimId}`);
                    this.tableData = [aimRecharge];
                    this.dataTotal = 1;
                }else{
                    let [datas, total] = await axiosGet('/user/auth/recharge/records?currentPage=' +
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
                this.dialog = {
                    alipayId: ''
                };
                this.$refs.dialog.resetFields();
            },
            submit() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let recharge = await axiosPost('/user/auth/recharge/add', this.dialog);
                            if (recharge) {
                                this.tableData.unshift(recharge);
                                if (recharge.state === 'success_recharge') {
                                    this.$store.commit('changeUserFunds', recharge.newFunds);
                                }
                                this.dialogVisible = false;
                            }
                        }else{
                            this.$message.error('充值交易号已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            username() {
                return this.$store.state.username;
            },
            canRecharge() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addRechargeUser';
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
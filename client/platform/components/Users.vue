<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="开户日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.registerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最近登录日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.lastLoginTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="账户名"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    label="等级"
                    min-width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.role.type === 'role_top'">一级代理</span>
                    <span v-if="scope.row.role.type === 'role_super'">二级代理</span>
                    <span v-if="scope.row.role.type === 'role_gold'">三级代理</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="site.name"
                    label="所属分站"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="状态"
                    width="94">
                <template slot-scope="scope">
                    <el-select v-if="canChangeState" size="small" v-model="scope.row.state" @change="changeUserState(scope.row)">
                        <el-option value="正常" label="正常"></el-option>
                        <el-option value="冻结" label="冻结"></el-option>
                        <el-option value="禁用" label="禁用"></el-option>
                    </el-select>
                    <span v-else>{{scope.row.state}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="可用金额"
                    min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.funds}}</span>
                    <i v-if="canEditFunds" class="el-icon-edit" style="color: #409EFF; cursor: pointer;" @click="addFunds(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column
                    prop="freezeFunds"
                    label="冻结金额"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="备注"
                    min-width="90">
                <template slot-scope="scope">
                    <el-popover
                            v-if="canRemark"
                            placement="bottom"
                            @show="loadUserRemarks(scope.row)"
                            trigger="click">
                        <el-button type="primary" size="mini" circle icon="el-icon-plus" @click="addRemark(scope.row)"></el-button>
                        <el-table :data="scope.row.remarks = []" :max-height="260">
                            <el-table-column min-width="160" prop="createTime" label="日期"></el-table-column>
                            <el-table-column min-width="220" prop="content" label="内容"></el-table-column>
                        </el-table>
                        <el-button size="small" slot="reference">内容</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="联系方式"
                    min-width="90">
                <template slot-scope="scope">
                    <el-popover
                            placement="bottom"
                            trigger="click">
                        <p class="contact-way">电话: {{ scope.row.phone }}</p>
                        <p class="contact-way">微信: {{ scope.row.weixin }}</p>
                        <p class="contact-way">QQ: {{ scope.row.qq }}</p>
                        <p class="contact-way">Emial: {{ scope.row.email }}</p>
                        <el-button size="small" slot="reference">联系</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="parent.username"
                    label="上级"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="children.length"
                    label="下级/人"
                    min-width="66">
            </el-table-column>
        </el-table>
        <el-pagination
                style="text-align: center;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTotal">
        </el-pagination>

        <el-dialog title="增加 / 减少用户金额" :visible.sync="addFundsVisible" top="3vh" width="30%" @closed="cancelAddFunds">
            <el-form :model="dialogAddFunds" :rules="dialogAddFundsRules" ref="dialogAddFunds" :label-width="dialogLabelWidth">
                <el-form-item label="类型" prop="state">
                    <el-select v-model="dialogAddFunds.state" placeholder="请选择操作类型">
                        <el-option value="plus_consume" label="增加金额"></el-option>
                        <el-option value="minus_consume" label="减少金额"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="金额" prop="money" placeholder="请输入需要增加 / 减少的金额！">
                    <el-input-number v-model="dialogAddFunds.money" :min="0" :precision="4" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="原因" prop="reason">
                    <el-input type="textarea" :rows="3" v-model.trim="dialogAddFunds.reason" placeholder="请输入增加 / 减少用户金额的原因，最多200个字符！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addFundsVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitAddFunds">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="dialogRemarkTitle" :visible.sync="dialogRemarkVisible" top="3vh" width="30%" @closed="cancelDialogRemark">
            <el-form :model="dialogRemark" :rules="dialogRemarkRules" ref="dialogRemark" label-width="60px">
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :rows="3" v-model.trim="dialogRemark.content" placeholder="请输入备注内容！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogRemarkVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitAddRemark">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";
    import {isNum} from "@/validaters";

    export default {
        name: "Users",
        async created() {
            await this.getTableData();
        },
        sockets: {
            mgUserChangeState(user) {
                let aim = this.tableData.find((item) => {
                    return item.id === user.id;
                });
                aim.state = user.state;
            }
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogLabelWidth: '88px',
                addFundsVisible: false,
                dialogAddFunds: {
                    state: '',
                    money: '',
                    reason: ''
                },
                dialogAddFundsRules: {
                    state: [
                        {required: true, message: '请选择操作类型！', trigger: 'change'}
                    ],
                    money: [
                        {required: true, message: '请输入增加 / 减少的金额！', trigger: 'blur'}
                    ],
                    reason: [
                        {required: true, message: '请输入增加 / 减少金额的原因！', trigger: 'blur'},
                        {max: 200, message: '原因内容不能超过200个字符！', trigger: 'blur'}
                    ]
                },
                dialogRemarkVisible: false,
                dialogRemarkTitle: '',
                dialogRemark: {
                    content: ''
                },
                dialogRemarkRules: {
                    content: [
                        {required: true, message: '请输入备注内容！', trigger: 'blur'},
                        {max: 280, message: '备注内容不能超过280个字符！', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                switch (row.state){
                    case '正常':
                        return 'normal-row';
                    case '冻结':
                        return 'freeze-row';
                    default:
                        return 'ban-row';
                }
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/platform/auth/users?currentPage=' +
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
            async loadUserRemarks(user) {
                user.remarks.splice(0);
                let remarks = await axiosGet('/platform/auth/user/' + user.id + '/remarks');
                remarks.forEach((remark) => {
                    user.remarks.push(remark);
                });
            },
            addRemark(user) {
                this.dialogRemarkTitle = '给账户 “' + user.username + '” 添加备注';
                this.dialogRemark.user = user;
                this.dialogRemarkVisible = true;
            },
            cancelDialogRemark() {
                this.$refs.dialogRemark.resetFields();
            },
            submitAddRemark() {
                this.$refs.dialogRemark.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/platform/auth/user/add/remark', {
                            userId: this.dialogRemark.user.id,
                            content: this.dialogRemark.content
                        });
                        this.dialogRemarkVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            cancelAddFunds() {
                this.$refs.dialogAddFunds.resetFields();
            },
            addFunds(user) {
                this.addFundsVisible = true;
                this.dialogAddFunds.id = user.id;
                this.dialogAddFunds.user = user;
            },
            submitAddFunds() {
                this.$refs.dialogAddFunds.validate(async (valid) => {
                    if (valid) {
                        let userFunds = await axiosPost('/platform/auth/user/change/funds', {
                            id: this.dialogAddFunds.id,
                            state: this.dialogAddFunds.state,
                            money: this.dialogAddFunds.money,
                            reason: this.dialogAddFunds.reason
                        });
                        if (userFunds !== undefined) {
                            let user = this.dialogAddFunds.user;
                            user.funds = userFunds;
                            this.addFundsVisible = false;
                        }
                    } else {
                        return false;
                    }
                });
            },
            async changeUserState(user) {
                await axiosPost('/platform/auth/user/change/state', {id: user.id, state: user.state});
            }
        },
        computed: {
            canChangeState() {
                return this.$store.state.permissions.some(item => {
                    return item === 'changeUserStatePlatform';
                });
            },
            canEditFunds() {
                return this.$store.state.permissions.some(item => {
                    return item === 'changeUserFundsPlatform';
                });
            },
            canRemark() {
                return this.$store.state.permissions.some(item => {
                    return item === 'remarkUserPlatform';
                });
            },
        }
    }
</script>

<style lang="scss">
    .el-table .normal-row {
        background: #F0F9EB;
    }

    .el-table .freeze-row {
        background: #FDF5E6;
    }

    .el-table .ban-row {
        background: #FEF0F0;
    }
</style>
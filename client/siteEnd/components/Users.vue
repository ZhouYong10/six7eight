<template>
    <div style="height: 100%">
        <el-button v-if="canAdd" size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="90%">
            <el-table-column
                    label="开户日期"
                    :show-overflow-tooltip="true"
                    min-width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.registerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最近登录日期"
                    :show-overflow-tooltip="true"
                    min-width="120">
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
                    prop="role.name"
                    label="角色"
                    min-width="80">
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
                    prop="funds"
                    label="可用金额"
                    min-width="90">
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
                    <el-popover v-if="canRemark"
                            placement="bottom"
                            @show="loadUserRemarks(scope.row)"
                            trigger="click">
                        <el-button type="primary" size="mini" circle icon="el-icon-plus" @click="addRemark(scope.row)"></el-button>
                        <el-table :data="currentRemarks" :max-height="260">
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
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button v-if="canEdit" type="primary" plain icon="el-icon-edit" size="small" @click="editUser(scope.row)">编 辑</el-button>
                </template>
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

        <el-dialog title="添加用户" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" :label-width="dialogLabelWidth">
                <el-form-item label="账户名" prop="username">
                    <el-input v-model="dialog.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="dialog.password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="rePass">
                    <el-input type="password" v-model="dialog.rePass"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="dialog.role" placeholder="请选择账户角色" @visible-change="loadRoles">
                        <el-option v-for="role in roles"
                                   :key="role.id"
                                   :label="role.name"
                                   :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="dialog.state" placeholder="请选择账户状态">
                        <el-option value="正常" label="正常"></el-option>
                        <el-option value="冻结" label="冻结"></el-option>
                        <el-option value="禁用" label="禁用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="dialog.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model="dialog.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model="dialog.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="dialog.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" size="small" @click="cancelDialog">重 置</el-button>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑用户信息" :visible.sync="dialogEditVisible" top="3vh" width="30%">
            <el-form :model="dialogEdit" ref="dialogEdit" :label-width="dialogLabelWidth">
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="dialogEdit.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model="dialogEdit.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model="dialogEdit.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="dialogEdit.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" size="small" @click="cancelEditDialog">重 置</el-button>
                <el-button size="small" @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitEditForm">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="dialogRemarkTitle" :visible.sync="dialogRemarkVisible" top="3vh" width="30%" @closed="cancelDialogRemark">
            <el-form :model="dialogRemark" :rules="dialogRemarkRules" ref="dialogRemark" label-width="60px">
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :rows="3" v-model="dialogRemark.content" placeholder="请输入备注内容！"></el-input>
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

    export default {
        name: "Users",
        async created() {
            await this.getTableData();
            this.$options.sockets[this.siteId + 'mgUserChangeState'] = (user) => {
                let users = this.tableData;
                let index = users.findIndex((item) => {
                    return item.id === user.id;
                });
                let aim = users[index];
                aim.state = user.state;
            };
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                roles: [],
                currentRemarks: [],
                dialogVisible: false,
                dialogLabelWidth: '88px',
                dialog: {
                    username: '',
                    password: '',
                    rePass: '',
                    role: '',
                    state: '正常',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogRules: {
                    username: [
                        { required: true, message: '请输入账户名！'},
                        { max: 25, message: '长度不能超过25 个字符'},
                        { validator: async (rule, value, callback) => {
                                let user = await axiosGet('/site/auth/user/' + value + '/exist');
                                if (user) {
                                    callback(new Error('账户: ' + value + ' 已经存在！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}

                    ],
                    password: [
                        { required: true, message: '请输入账户密码！', trigger: 'change' },
                        { validator: (rule, value, callback)=>{
                                if (this.dialog.rePass !== '') {
                                    this.$refs.dialogForm.validateField('rePass');
                                }
                                callback();
                            }, trigger: 'change'}
                    ],
                    rePass: [
                        { required: true, message: '请再次输入密码！', trigger: 'change' },
                        { validator: (rule, value, callback) => {
                                if (value !== this.dialog.password) {
                                    callback(new Error('两次输入的密码不一致！'));
                                }else{
                                    callback();
                                }
                            }, trigger: 'change'}

                    ],
                    role: [
                        { required: true, message: '请选择账户角色！', trigger: 'change' }
                    ]
                },
                dialogEditVisible: false,
                dialogEdit: {
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
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
                let [datas, total] = await axiosGet('/site/auth/users?currentPage=' +
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
                this.currentRemarks = await axiosGet('/site/auth/user/' + user.id + '/remarks');
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
                        await axiosPost('/site/auth/user/add/remark', {
                            userId: this.dialogRemark.user.id,
                            content: this.dialogRemark.content
                        });
                        this.dialogRemarkVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async loadRoles() {
                if (this.roles.length < 1) {
                    this.roles = await axiosGet('/site/auth/user/roles');
                }
            },
            cancelDialog() {
                this.$refs.dialogForm.resetFields();
            },
            submitForm() {
                this.$refs.dialogForm.validate(async (valid) => {
                    if (valid) {
                        let user = await axiosPost('/site/auth/user/save', this.dialog);
                        this.tableData.unshift(user);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            changeUserState(user) {
                axiosPost('/site/auth/user/change/state', {id: user.id, state: user.state});
            },
            cancelEditDialog() {
                this.dialogEdit = {
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                };
                this.$refs.dialogEdit.resetFields();
            },
            async editUser(user) {
                this.dialogEdit = {
                    id: user.id,
                    phone: user.phone,
                    weixin: user.weixin,
                    qq: user.qq,
                    email: user.email,
                    rowUser: user
                };
                this.dialogEditVisible = true;
            },
            async submitEditForm() {
                this.$refs.dialogEdit.validate((valid) => {
                    if (valid) {
                        let info = this.dialogEdit;
                        axiosPost('/site/auth/user/update', {
                            id: info.id,
                            phone: info.phone,
                            weixin: info.weixin,
                            qq: info.qq,
                            email: info.email,
                        });
                        let user = this.dialogEdit.rowUser;
                        user.phone = info.phone;
                        user.weixin = info.weixin;
                        user.qq = info.qq;
                        user.email = info.email;
                        this.dialogEditVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            },
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addUserListSite';
                });
            },
            canChangeState() {
                return this.$store.state.permissions.some(item => {
                    return item === 'changeStateUserListSite';
                });
            },
            canRemark() {
                return this.$store.state.permissions.some(item => {
                    return item === 'remarkUserListSite';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editUserListSite';
                });
            }
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
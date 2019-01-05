<template>
    <div style="height: 100%">
        <el-button v-if="canAddUser && canAdd"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="82%">
            <el-table-column
                    label="开户日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.registerTime | myFormatDate}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最近登录日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.lastLoginTime | myFormatDate}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="账户名"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    label="联系方式"
                    min-width="90">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
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
                    prop="state"
                    label="状态"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="childNum"
                    label="下级/人"
                    min-width="70">
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
                    fixed="right"
                    label="操作"
                    width="92">
                <template slot-scope="scope">
                    <el-button v-if="canEdit" type="primary" plain icon="el-icon-edit" size="small" @click="editUser(scope.row)">编 辑</el-button>
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

        <el-dialog title="添加下级用户" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" :label-width="dialogLabelWidth">
                <el-form-item label="账户名" prop="username">
                    <el-input v-model.trim="dialog.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="dialog.password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码" prop="rePass">
                    <el-input type="password" v-model="dialog.rePass"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model.trim="dialog.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model.trim="dialog.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model.trim="dialog.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model.trim="dialog.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" size="small" @click="cancelDialog">重 置</el-button>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑下级用户信息" :visible.sync="dialogEditVisible" top="3vh" width="30%">
            <el-form :model="dialogEdit" :rules="dialogEditRules" ref="dialogEdit" :label-width="dialogLabelWidth">
                <el-form-item label="电话" prop="phone">
                    <el-input v-model.trim="dialogEdit.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model.trim="dialogEdit.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model.trim="dialogEdit.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model.trim="dialogEdit.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitEditForm">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost, myDateFromat} from "@/utils";

    export default {
        name: "LowerUsers",
        async created() {
            await this.getTableData();
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogVisible: false,
                dialogLabelWidth: '88px',
                dialog: {
                    username: '',
                    password: '',
                    rePass: '',
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
                                let user = await axiosGet('/user/auth/lower/user/' + value + '/exist');
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
                    phone: [
                        {max: 14, message: '长度不能超过14个字符！', trigger: 'blur'}
                    ],
                    weixin: [
                        {max: 18, message: '长度不能超过18个字符！', trigger: 'blur'}
                    ],
                    qq: [
                        {max: 16, message: '长度不能超过16个字符！', trigger: 'blur'}
                    ],
                    email: [
                        {max: 32, message: '长度不能超过32个字符！', trigger: 'blur'}
                    ]
                },
                dialogEditVisible: false,
                dialogEdit: {
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogEditRules: {
                    phone: [
                        {max: 14, message: '长度不能超过14个字符！', trigger: 'blur'}
                    ],
                    weixin: [
                        {max: 18, message: '长度不能超过18个字符！', trigger: 'blur'}
                    ],
                    qq: [
                        {max: 16, message: '长度不能超过16个字符！', trigger: 'blur'}
                    ],
                    email: [
                        {max: 32, message: '长度不能超过32个字符！', trigger: 'blur'}
                    ]
                },
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
                let [datas, total] = await axiosGet('/user/auth/lower/users?currentPage=' +
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
                    username: '',
                    password: '',
                    rePass: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                };
                this.$refs.dialogForm.resetFields();
            },
            submitForm() {
                this.$refs.dialogForm.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let user = await axiosPost('/user/auth/lower/user/save', this.dialog);
                            if (user) {
                                user.childNum = 0;
                                user.roleName = user.role.name;
                                this.tableData.unshift(user);
                                this.dialogVisible = false;
                            }
                        }else {
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            cancelEditDialog() {
                this.$refs.dialogEdit.resetFields();
            },
            async editUser(user) {
                this.dialogEdit = {
                    id: user.id,
                    phone: user.phone,
                    weixin: user.weixin,
                    qq: user.qq,
                    email: user.email,
                    user: user
                };
                this.dialogEditVisible = true;
            },
            async submitEditForm() {
                this.$refs.dialogEdit.validate((valid) => {
                    if (valid) {
                        let info = this.dialogEdit;
                        axiosPost('/user/auth/lower/user/update', {
                            id: info.id,
                            phone: info.phone,
                            weixin: info.weixin,
                            qq: info.qq,
                            email: info.email
                        });
                        let user = this.dialogEdit.user;
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
            canAddUser() {
                return this.$store.state.canAddUser;
            },
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addLowerUser';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editLowerUser';
                });
            }
        },
        filters: {
            myFormatDate(val) {
                return myDateFromat(val);
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
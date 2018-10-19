<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 66px;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="开户日期"
                    width="160">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.registerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最近登录日期"
                    width="160">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.lastLoginTime}}</span>
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
                        <el-button slot="reference">联系</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="状态"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="role.name"
                    label="角色"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="childrenNum"
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
                    width="188">
                <template slot-scope="scope">

                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="editUser(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="delUser(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

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
            <el-form :model="dialogEdit" :rules="dialogEditRules" ref="dialogEdit" :label-width="dialogLabelWidth">
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
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "LowerUsers",
        async created() {
            this.tableData = await axiosGet('/user/auth/lower/users');
        },
        data() {
            return {
                tableData: [],
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

                    ]
                },
                dialogEditVisible: false,
                dialogEdit: {
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
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
            cancelDialog() {
                this.$refs.dialogForm.resetFields();
            },
            submitForm() {
                this.$refs.dialogForm.validate(async (valid) => {
                    if (valid) {
                        let user = await axiosPost('/user/auth/lower/user/save', this.dialog);
                        this.tableData.unshift(user);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            cancelEditDialog() {
                this.dialogEdit = {
                    username: '',
                    role: '',
                    state: 'normal',
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
                    username: user.username,
                    oldUsername: user.username,
                    role: user.role.id,
                    state: user.state,
                    phone: user.phone,
                    weixin: user.weixin,
                    qq: user.qq,
                    email: user.email
                };
                this.dialogEdit.rowUser = user;
                this.dialogEditVisible = true;
            },
            async submitEditForm() {
                this.$refs.dialogEdit.validate(async (valid) => {
                    if (valid) {
                        let updateUser = await axiosPost('/user/auth/lower/user/update', this.dialogEdit);
                        let user = this.dialogEdit.rowUser;
                        user.username = updateUser.username;
                        user.role = updateUser.role;
                        user.state = updateUser.state;
                        user.phone = updateUser.phone;
                        user.weixin = updateUser.weixin;
                        user.qq = updateUser.qq;
                        user.email = updateUser.email;
                        this.dialogEditVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async delUser(id) {
                this.$confirm('此操作将永久删除所选管理员！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/user/auth/lower/user/del/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
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
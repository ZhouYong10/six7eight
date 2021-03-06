<template>
    <div style="height: 100%">
        <el-button v-if="roleType === 'role_site'"
                   size="medium" style="margin: 0 6px 6px;"
                   type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="开户日期"
                    min-width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.registerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最后登录日期"
                    min-width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.lastLoginTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="账户名"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="角色"
                    min-width="100">
                <template slot-scope="scope">
                    <div v-if="roleType === 'role_site'">
                        <span v-if="scope.row.role.type === 'role_site'">
                            {{scope.row.role.name}}
                        </span>
                        <el-select v-else
                                   v-model="scope.row.role.id"
                                   @change="function (roleId){
                                    changeAdminRole(scope.row.id, roleId);
                                }">
                            <el-option v-for="role in roles"
                                       :key="role.id"
                                       :label="role.name"
                                       :value="role.id"></el-option>
                        </el-select>
                    </div>

                    <span v-else>
                        {{scope.row.role.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="94">
                <template slot-scope="scope">
                    <div v-if="roleType === 'role_site'">
                        <span v-if="scope.row.role.type === 'role_site'">
                            {{scope.row.state}}
                        </span>
                        <el-select v-else
                                   v-model="scope.row.state"
                                   @change="changeAdminState(scope.row)">
                            <el-option value="正常" label="正常"></el-option>
                            <el-option value="冻结" label="冻结"></el-option>
                            <el-option value="禁用" label="禁用"></el-option>
                        </el-select>
                    </div>

                    <span v-else>
                        {{scope.row.state}}
                    </span>
                </template>
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
                    v-if="roleType === 'role_site'"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.row.role.type !== 'role_site'"
                            type="danger"
                            size="small"
                            @click="delUser(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加管理员" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
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
                <el-form-item label="角色" prop="role">
                    <el-select v-model="dialog.role" placeholder="请选择账户角色">
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
                <el-button type="info" size="small" @click="cancelDialog">重置</el-button>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";
    import {hasBackslash} from '@/validaters';

    export default {
        name: "Admins",
        async created() {
            this.roles = await axiosGet('/site/auth/admin/roles/type/user');
            this.tableData = await axiosGet('/site/auth/admins');
        },
        data() {
            return {
                tableData: [],
                roles: [],
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
                                if (!hasBackslash(value)) {
                                    let user = await axiosPost('/site/auth/admin/username/exist', {username: value});
                                    if (user) {
                                        callback(new Error('账户: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback(new Error('管理员账户名中不能包含特殊字符“/”!'));
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
            changeAdminRole(adminId, roleId) {
                axiosPost('/site/auth/admin/change/role', {adminId: adminId, roleId: roleId});
            },
            changeAdminState(admin) {
                axiosPost('/site/auth/admin/change/state', {id: admin.id, state: admin.state});
            },
            cancelDialog() {
                this.dialog = {
                    username: '',
                    password: '',
                    rePass: '',
                    role: '',
                    state: '正常',
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
                            let user = await axiosPost('/site/auth/admin/save', this.dialog);
                            if (user) {
                                this.tableData.unshift(user);
                                this.dialogVisible = false;
                            }else{
                                this.dialog.isCommitted = false;
                            }
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
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
                    await axiosGet('/site/auth/admin/del/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
        computed: {
            roleType() {
                return this.$store.state.roleType;
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
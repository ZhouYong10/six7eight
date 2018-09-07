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
                    label="建站日期"
                    min-width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="名称"
                    min-width="180">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            width="400"
                            trigger="click">
                        <el-row>
                            <el-col :span="24"><div></div></el-col>
                            <el-row>
                                <el-col :span="24"><div></div></el-col>
                            </el-row>
                        </el-row>
                        <el-button slot="reference">{{scope.row.name}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="用户可用资金"
                    prop="userFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="用户冻结资金"
                    prop="userFreezeFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点可用资金"
                    prop="funds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点冻结资金"
                    prop="freezeFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点返利"
                    prop="profit"
                    min-width="110">
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

        <el-dialog title="添加站点" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialogForm" :label-width="dialogLabelWidth">
                <el-form-item label="站名" prop="name">
                    <el-input v-model="dialog.name"></el-input>
                </el-form-item>
                <el-form-item label="域名" prop="address">
                    <el-input v-model="dialog.address"></el-input>
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
                <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
                <el-button type="info" size="small" @click="cancelDialog">重置</el-button>
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑管理员" :visible.sync="dialogEditVisible" top="3vh" width="30%">
            <el-form :model="dialogEdit" :rules="dialogEditRules" ref="dialogEdit" :label-width="dialogLabelWidth">
                <el-form-item label="账户名" prop="username">
                    <el-input v-model="dialogEdit.username"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="dialogEdit.role" placeholder="请选择账户角色" @visible-change="loadRoles">
                        <el-option v-for="role in roles"
                                   :key="role.id"
                                   :label="role.name"
                                   :value="role.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="dialogEdit.state" placeholder="请选择账户状态">
                        <el-option value="normal" label="正常"></el-option>
                        <el-option value="freeze" label="冻结"></el-option>
                        <el-option value="ban" label="禁用"></el-option>
                    </el-select>
                </el-form-item>
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
                <el-button type="primary" size="small" @click="submitEditForm">确 定</el-button>
                <el-button type="info" size="small" @click="cancelEditDialog">重置</el-button>
                <el-button size="small" @click="dialogEditVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "Sites",
        async created() {
            this.tableData = await axiosGet('/platform/auth/sites');
        },
        data() {
            return {
                tableData: [],
                roles: [],
                dialogVisible: false,
                dialogLabelWidth: '100px',
                dialog: {
                    name: '',
                    address: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogRules: {
                    name: [
                        { required: true, message: '请输入站点名！'},
                        { max: 48, message: '长度不能超过48个字符！'}

                    ],
                    address: [
                        { required: true, message: '请输入站点域名！'}

                    ]
                },
                dialogEditVisible: false,
                dialogEdit: {
                    username: '',
                    role: '',
                    state: 'normal',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogEditRules:{
                    username: [
                        { required: true, message: '请输入账户名！'},
                        { max: 25, message: '长度不能超过25 个字符'},
                        { validator: async (rule, value, callback) => {
                                let oldUsername = this.dialogEdit.oldUsername;
                                if (value !== oldUsername) {
                                    let user = await axiosGet('/platform/auth/' + value + '/exist');
                                    if (user) {
                                        callback(new Error('账户: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}

                    ],
                    role: [
                        { required: true, message: '请选择账户角色！', trigger: 'change' }
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
            async loadRoles(isVisible) {
                if (this.roles.length < 1 && isVisible) {
                    this.roles = await axiosGet('/platform/auth/admin/roles');
                }
            },
            cancelDialog() {
                this.$refs.dialogForm.resetFields();
            },
            submitForm() {
                this.$refs.dialogForm.validate(async (valid) => {
                    if (valid) {
                        let site = await axiosPost('/platform/auth/site/add', this.dialog);
                        console.log(site,'==================')
                        this.tableData.unshift(site);
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
                if (this.roles.length < 1) {
                    this.roles = await axiosGet('/platform/auth/admin/roles');
                }
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
                        let updateUser = await axiosPost('/platform/auth/admin/update', this.dialogEdit);
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
                    await axiosGet('/platform/auth/admin/del/' + id);
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
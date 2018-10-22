<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="开户日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.registerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最近登录日期"
                    width="180">
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
                    prop="site.name"
                    label="所属分站"
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
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="parent.username"
                    label="上级"
                    min-width="66">
            </el-table-column>
            <el-table-column
                    prop="children.length"
                    label="下级/人"
                    min-width="66">
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

        <el-dialog title="编辑用户信息" :visible.sync="dialogVisible" top="3vh" width="30%">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="状态" prop="state">
                    <el-select v-model="dialog.state" placeholder="请选择账户状态">
                        <el-option value="normal" label="正常"></el-option>
                        <el-option value="freeze" label="冻结"></el-option>
                        <el-option value="ban" label="禁用"></el-option>
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
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submitEditForm">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "Users",
        async created() {
            this.tableData = await axiosGet('/platform/auth/users');
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '88px',
                dialogVisible: false,
                dialog: {
                    state: 'normal',
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
            async editUser(user) {
                this.dialog = {
                    id: user.id,
                    state: user.state,
                    phone: user.phone,
                    weixin: user.weixin,
                    qq: user.qq,
                    email: user.email,
                    user: user
                };
                this.dialogVisible = true;
            },
            async submitEditForm() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let updateUser = await axiosPost('/platform/auth/user/update', {
                            id: this.dialog.id,
                            state: this.dialog.state,
                            phone: this.dialog.phone,
                            weixin: this.dialog.weixin,
                            qq: this.dialog.qq,
                            email: this.dialog.email
                        });
                        let user = this.dialog.user;
                        user.state = updateUser.state;
                        user.phone = updateUser.phone;
                        user.weixin = updateUser.weixin;
                        user.qq = updateUser.qq;
                        user.email = updateUser.email;
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async delUser(id) {
                this.$confirm('此操作将永久删除所选下级用户！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/lower/user/del/' + id);
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
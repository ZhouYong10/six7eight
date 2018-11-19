<template>
    <div style="height: 100%">

        <el-row type="flex" justify="end" v-if="roleType === 'role_developer'">
            <el-col style="text-align: right; padding-right: 50px;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="创建日期"
                    min-width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="角色名"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    label="权限"
                    min-width="300">
                <template slot-scope="scope">
                    <el-popover
                            @show="rightDetails(scope.row.rights, 'showRight' + scope.$index)"
                            placement="right"
                            trigger="click">
                        <el-tree
                                :data="viewRights"
                                show-checkbox
                                default-expand-all
                                node-key="id"
                                :props="props"
                                :ref="'showRight' + scope.$index"
                                highlight-current>
                        </el-tree>
                        <el-button type="success" plain icon="el-icon-tickets" size="small" slot="reference">详 情</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="188">
                <template slot-scope="scope" v-if="roleType === 'role_developer'">
                        <el-button
                                v-if="scope.row.type !== 'role_developer'"
                                type="primary"
                                plain
                                icon="el-icon-edit"
                                size="small"
                                @click="editRole(scope.row)">编 辑</el-button>
                        <el-button
                                v-if="scope.row.type !== 'role_developer'"
                                type="danger"
                                plain
                                icon="el-icon-delete"
                                size="small"
                                @click="removeRole(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" >
                    <el-tree
                            :data="rights"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            :props="props"
                            ref="editRight"
                            highlight-current>
                    </el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="!dialog.edit" type="primary" @click="addRole">确 定</el-button>
                <el-button v-if="dialog.edit" type="primary" @click="updateRole">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "AdminsRole",
        async created() {
            this.viewRights = await axiosGet('/platform/auth/role/view/rights');
            this.tableData = await axiosGet('/platform/auth/admin/roles');
        },
        data() {
            return {
                tableData: [],
                viewRights: [],
                dialogVisible: false,
                dialogLabelWidth: '60px',
                dialogTitle: '添加角色',
                dialog: {
                    name: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入角色名称！', trigger: 'blur'},
                        {validator: async (rule, value, callback) => {
                                let role = await axiosGet('/platform/auth/role/' + value + '/exist');
                                if (role) {
                                    callback(new Error('角色 "' + value + '" 已经存在！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ]
                },
                props: {
                    label: 'name',
                    children: 'children'
                }
            }
        },
        methods: {
            rightDetails(rights, refRightName){
                this.$refs[refRightName].setCheckedKeys(rights);
            },
            cancelDialog() {
                this.dialogTitle = '添加角色';
                this.dialog = {
                    name: ''
                };
                this.$refs.editRight.setCheckedKeys([]);
            },
            async addRole() {
                let roleSaved = await axiosPost('/platform/auth/role/save', {
                    name: this.dialog.name,
                    rights: this.$refs.editRight.getCheckedKeys(true)
                });
                this.tableData.unshift(roleSaved);
                this.dialogVisible = false;
            },
            editRole(role) {
                this.dialogTitle = '编辑角色';
                this.dialog.name = role.name;
                this.dialog.id = role.id;
                this.dialog.edit = true;
                this.dialog.role = role;
                if (!this.$refs.editRight) {
                    setTimeout(() => {
                        this.$refs.editRight.setCheckedKeys(role.rights);
                    }, 100);
                } else {
                    this.$refs.editRight.setCheckedKeys(role.rights);
                }
                this.dialogVisible = true;
            },
            async updateRole() {
                let rights = this.$refs.editRight.getCheckedKeys(true);
                await axiosPost('/platform/auth/role/update', {
                    id: this.dialog.id,
                    name: this.dialog.name,
                    rights: rights
                });
                this.dialog.role.name = this.dialog.name;
                this.dialog.role.rights = rights;
                this.dialogVisible = false;
            },
            async removeRole(id) {
                this.$confirm('此操作将永久删除所选角色！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/role/remove/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
        computed: {
            rights() {
                return this.$store.state.rights;
            },
            roleType() {
                return this.$store.state.user.role.type;
            }
        }
    }
</script>

<style lang="scss">

</style>
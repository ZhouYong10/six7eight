<template>
    <div style="height: 100%">
        <el-button v-if="roleType === 'role_developer'"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="创建日期"
                    min-width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="角色名"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    label="权限"
                    min-width="100">
                <template slot-scope="scope">
                    <el-popover
                            @show="rightDetails(scope.row.editRights, 'showRight' + scope.$index)"
                            placement="right"
                            trigger="click">
                        <el-tree
                                :data="viewRights"
                                show-checkbox
                                node-key="fingerprint"
                                :props="viewProps"
                                :ref="'showRight' + scope.$index"
                                highlight-current>
                        </el-tree>
                        <el-button type="success" plain icon="el-icon-tickets" size="small" slot="reference">详 情</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="roleType === 'role_developer'"
                    label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button
                                type="primary" size="small"
                                @click="editRole(scope.row)">编 辑</el-button>
                        <el-button
                                v-if="scope.row.type !== 'role_developer'"
                                type="danger" size="small"
                                @click="removeRole(scope.row.id)">删 除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" >
                    <el-tree
                            :data="viewRights"
                            show-checkbox
                            node-key="fingerprint"
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
    import {axiosGet, axiosPost} from "@/slfaxios";

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
                                let oldRole = this.dialog.role;
                                let name = null;
                                if (oldRole) {
                                    name = oldRole.name;
                                }
                                if (!name || value !== name) {
                                    let role = await axiosGet('/platform/auth/role/' + value + '/exist');
                                    if (role) {
                                        callback(new Error('角色 "' + value + '" 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ]
                },
                props: {
                    label: 'name',
                    children: 'children'
                },
                viewProps: {
                    label: 'name',
                    children: 'children',
                    disabled: () => {
                        return true;
                    }
                }
            }
        },
        methods: {
            rightDetails(editRights, refRightName){
                this.$refs[refRightName].setCheckedKeys(editRights);
            },
            cancelDialog() {
                this.dialogTitle = '添加角色';
                this.dialog = {
                    name: ''
                };
                this.$refs.dialog.resetFields();
                this.$refs.editRight.setCheckedKeys([]);
            },
            async addRole() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let checked = this.$refs.editRight.getCheckedKeys();
                            let halfCheck = this.$refs.editRight.getHalfCheckedKeys();
                            let roleSaved = await axiosPost('/platform/auth/role/save', {
                                name: this.dialog.name,
                                editRights: checked,
                                rights: checked.concat(halfCheck)
                            });
                            this.tableData.unshift(roleSaved);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
            },
            editRole(role) {
                this.dialogTitle = '编辑角色';
                this.dialog.name = role.name;
                this.dialog.id = role.id;
                this.dialog.edit = true;
                this.dialog.role = role;
                if (!this.$refs.editRight) {
                    setTimeout(() => {
                        this.$refs.editRight.setCheckedKeys(role.editRights);
                    }, 100);
                } else {
                    this.$refs.editRight.setCheckedKeys(role.editRights);
                }
                this.dialogVisible = true;
            },
            async updateRole() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let checked = this.$refs.editRight.getCheckedKeys();
                            let halfChecked = this.$refs.editRight.getHalfCheckedKeys();
                            let rights = checked.concat(halfChecked);
                            await axiosPost('/platform/auth/role/update', {
                                id: this.dialog.id,
                                name: this.dialog.name,
                                editRights: checked,
                                rights: rights
                            });
                            this.dialog.role.name = this.dialog.name;
                            this.dialog.role.editRights = checked;
                            this.dialog.role.rights = rights;
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
                    } else {
                        return false;
                    }
                });
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
                return this.$store.state.menus;
            },
            roleType() {
                return this.$store.state.roleType;
            }
        }
    }
</script>

<style lang="scss">

</style>
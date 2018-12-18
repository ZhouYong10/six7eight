<template>
    <div style="height: 100%">
        <el-button v-if="roleType === 'role_site'"
                   type="success" size="small" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

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
                    min-width="160">
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
                    v-if="roleType === 'role_site'"
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.row.type !== 'role_site'"
                            type="primary"
                            plain
                            icon="el-icon-edit"
                            size="small"
                            @click="edit(scope.row)">编 辑</el-button>
                    <el-button
                            v-if="scope.row.type !== 'role_site'"
                            type="danger"
                            plain
                            icon="el-icon-delete"
                            size="small"
                            @click="remove(scope.row.id)">删 除</el-button>
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
                            :data="menus"
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
                <el-button v-if="!dialog.edit" type="primary" @click="add">确 定</el-button>
                <el-button v-if="dialog.edit" type="primary" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "AdminRole",
        async created() {
            this.viewRights = await axiosGet('/site/auth/role/view/rights');
            this.tableData = await axiosGet('/site/auth/admin/roles');
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
                                    let role = await axiosGet('/site/auth/role/' + value + '/exist');
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
            async add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let checked = this.$refs.editRight.getCheckedKeys();
                        let halfCheck = this.$refs.editRight.getHalfCheckedKeys();
                        let roleSaved = await axiosPost('/site/auth/role/save', {
                            name: this.dialog.name,
                            editRights: checked,
                            rights: checked.concat(halfCheck)
                        });
                        this.tableData.unshift(roleSaved);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(role) {
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
            async update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let checked = this.$refs.editRight.getCheckedKeys();
                        let halfChecked = this.$refs.editRight.getHalfCheckedKeys();
                        let rights = checked.concat(halfChecked);
                        axiosPost('/site/auth/role/update', {
                            id: this.dialog.id,
                            name: this.dialog.name,
                            editRights: checked,
                            rights: rights
                        }).then(() => {
                            this.dialog.role.name = this.dialog.name;
                            this.dialog.role.editRights = checked;
                            this.dialog.role.rights = rights;
                            this.dialogVisible = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            async remove(id) {
                this.$confirm('此操作将永久删除所选角色！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/site/auth/role/remove/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
        computed: {
            menus() {
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
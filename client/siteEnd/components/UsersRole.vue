<template>
    <div style="height: 100%">

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
                    min-width="90">
                <template slot-scope="scope">
                    <el-popover
                            @show="rightDetails(scope.row.editRights, 'showRight' + scope.$index)"
                            placement="right"
                            trigger="click">
                        <el-tree
                                :data="rights"
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
                    label="操作">
                <template slot-scope="scope">
                    <el-button v-if="canEdit"
                               type="primary" size="small"
                               @click="edit(scope.row)">编 辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="编辑角色" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" >
                    <el-tree
                            :data="rights"
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
                <el-button type="primary" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";

    export default {
        name: "UsersRole",
        async created() {
            this.rights = await axiosGet('/site/auth/user/right/show');
            this.tableData = await axiosGet('/site/auth/user/roles');
        },
        data() {
            return {
                rights: [],
                dialogVisible: false,
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
                },
                dialog: {
                    name: ''
                },
                dialogRules: {
                    name: [
                        { required: true, message: '请输入角色名！'},
                        { max: 25, message: '长度不能超过25 个字符'},
                    ],
                },
                dialogLabelWidth: '60px',
                tableData: []
            }
        },
        methods: {
            rightDetails(editRights, refRightName){
                this.$refs[refRightName].setCheckedKeys(editRights);
            },
            cancelDialog() {
                this.dialog = {
                    name: ''
                };
                this.$refs.editRight.setCheckedKeys([]);
            },
            edit(role) {
                this.dialog.name = role.name;
                this.dialog.id = role.id;
                this.dialog.role = role;
                if (!this.$refs.editRight) {
                    setTimeout(() => {
                        this.$refs.editRight.setCheckedKeys(role.editRights);
                    }, 1);
                } else {
                    this.$refs.editRight.setCheckedKeys(role.editRights);
                }
                this.dialogVisible = true;
            },
            async update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let checked = this.$refs.editRight.getCheckedKeys();
                            let halfChecked = this.$refs.editRight.getHalfCheckedKeys();
                            let rights = checked.concat(halfChecked);
                            await axiosPost('/site/auth/user/role/update', {
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
            }
        },
        computed: {
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editUserRoleSite';
                });
            }
        }
    }
</script>

<style lang="scss">

</style>
<template>
    <div style="height: 100%">

        <el-row type="flex" justify="end">
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
                            @show="rightDetails(scope.row.rights[1], 'showRight' + scope.$index)"
                            placement="right"
                            trigger="hover">
                        <el-tree
                                :data="rights"
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
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="editRole(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="removeRole(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加角色" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" >
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
    import {axiosGet, axiosPost, rightFilter} from "@/utils";

    export default {
        name: "AdminsRole",
        async created() {
            this.rights = await axiosGet('/platform/auth/right/show');
            this.tableData = await axiosGet('/platform/auth/admin/roles');
        },
        data() {
            return {
                rights: [],
                dialogVisible: false,
                props: {
                    label: 'name',
                    children: 'children'
                },
                dialog: {
                    name: ''
                },
                dialogLabelWidth: '60px',
                tableData: []
            }
        },
        methods: {
            rightDetails(rights, refRightName){
                this.$refs[refRightName].setCheckedNodes(rights);
            },
            cancelDialog() {
                this.dialog = {
                    name: ''
                };
                this.$refs.editRight.setCheckedNodes([]);
            },
            async addRole() {
                let checkedRight = this.$refs.editRight.getCheckedNodes(true);
                let userRight = rightFilter(JSON.parse(JSON.stringify(this.rights)), checkedRight);
                let roleSaved = await axiosPost('/platform/auth/role/save', {
                    name: this.dialog.name,
                    rights: [userRight, checkedRight]
                });
                this.tableData.unshift(roleSaved);
                this.dialogVisible = false;
            },
            editRole(role) {
                this.dialogVisible = true;
                this.dialog.name = role.name;
                this.dialog.id = role.id;
                this.dialog.edit = true;
                this.dialog.role = role;
                if (!this.$refs.editRight) {
                    setTimeout(() => {
                        this.$refs.editRight.setCheckedNodes(role.rights[1] ? role.rights[1] : []);
                    }, 100);
                } else {
                    this.$refs.editRight.setCheckedNodes(role.rights[1] ? role.rights[1] : []);
                }
            },
            async updateRole() {
                let checkedRight = this.$refs.editRight.getCheckedNodes(true);
                let userRight = rightFilter(JSON.parse(JSON.stringify(this.rights)), checkedRight);
                await axiosPost('/platform/auth/role/update', {
                    id: this.dialog.id,
                    name: this.dialog.name,
                    rights: [userRight, checkedRight]
                });
                this.dialog.role.name = this.dialog.name;
                this.dialog.role.rights = [userRight, checkedRight];
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
        }
    }
</script>

<style lang="scss">

</style>
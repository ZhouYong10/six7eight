<template>
    <div style="height: 100%">

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
                            trigger="hover">
                        <el-tree
                                :data="rights"
                                show-checkbox
                                default-expand-all
                                node-key="fingerprint"
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
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="编辑角色" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" >
                    <el-input v-model="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" >
                    <el-tree
                            :data="rights"
                            show-checkbox
                            default-expand-all
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
    import {axiosGet, axiosPost} from "@/utils";

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
                dialog: {
                    name: ''
                },
                dialogLabelWidth: '60px',
                tableData: []
            }
        },
        methods: {
            rightDetails(rights, refRightName){
                this.$refs[refRightName].setCheckedKeys(rights);
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
                        this.$refs.editRight.setCheckedKeys(role.rights);
                    }, 1);
                } else {
                    this.$refs.editRight.setCheckedKeys(role.rights);
                }
                this.dialogVisible = true;
            },
            async update() {
                let rights = this.$refs.editRight.getCheckedKeys();
                await axiosPost('/site/auth/user/role/update', {
                    id: this.dialog.id,
                    name: this.dialog.name,
                    rights: rights
                });
                this.dialog.role.name = this.dialog.name;
                this.dialog.role.rights = rights;
                this.dialogVisible = false;
            }
        }
    }
</script>

<style lang="scss">

</style>
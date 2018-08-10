<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col :span="7">
                <el-button type="success" icon="el-icon-circle-plus-outline" @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>
        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="创建日期"
                    width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime | myFormatDate}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="角色名">
            </el-table-column>
            <el-table-column
                    label="权限">
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
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small">删 除</el-button>
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
                <el-button type="primary" @click="getCheckedRight">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost, rightFilter} from "@/utils";
    import mixin from "@/mixin";

    export default {
        name: "Sites",
        mixins: [mixin],
        async created() {
            let resRight = await axiosGet('/platform/auth/right/show');
            this.rights = resRight.data;
            let resRole = await axiosGet('/platform/auth/admin/roles');
            this.tableData = resRole.data;
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
                this.dialog.name = '';
                this.$refs.editRight.setCheckedKeys([]);
            },
            async getCheckedRight() {
                let checkedRight = this.$refs.editRight.getCheckedNodes(true);
                let userRight = rightFilter(JSON.parse(JSON.stringify(this.rights)), checkedRight);
                let res = await axiosPost('/platform/auth/role/save', {
                    name: this.dialog.name,
                    rights: [userRight, checkedRight]
                });
                this.tableData.unshift(res.data);
                this.dialogVisible = false;
            }
        }
    }
</script>

<style lang="scss">

</style>
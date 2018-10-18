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
                    label="发布日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="user.username"
                    label="发布账户"
                    width="110">
            </el-table-column>
            <el-table-column
                    label="发布站点"
                    width="120">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            trigger="hover">
                        <p class="to-site" v-for="site in scope.row.sites">{{ site.name }}</p>
                        <el-button type="success" plain icon="el-icon-tickets" size="small" slot="reference">站点</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="remove(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="内容" prop="content">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入内容"
                            v-model="dialog.content">
                    </el-input>
                </el-form-item>
                <el-form-item label="发布站点" >
                    <el-tree
                            :data="sites"
                            show-checkbox
                            default-expand-all
                            :expand-on-click-node="false"
                            :check-on-click-node="true"
                            node-key="id"
                            :default-checked-keys="[0]"
                            :props="props"
                            ref="checkedSites"
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
        name: "Placard",
        async created() {
            this.tableData = await axiosGet('/platform/auth/placards');
            this.sites = [{
                id: 0,
                name: '全部',
                children: await axiosGet('/platform/auth/sites')
            }];
        },
        data() {
            return {
                tableData: [],
                sites: [],
                dialogLabelWidth: '80px',
                dialogVisible: false,
                dialogTitle: '添加公告',
                dialog: {
                    content: ''
                },
                rules: {
                    content: [
                        {required: true, message: '请输公告内容!', trigger: 'blur'}
                    ]
                },
                props: {
                    label: 'name',
                    children: 'children'
                }
            }
        },
        methods: {
            cancelDialog() {
                this.dialogTitle = "添加公告";
                this.$refs.dialog.resetFields();
                this.dialog.content = '';
                this.$refs.checkedSites.setCheckedKeys([0]);
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let placard = await axiosPost('/platform/auth/placard/add', {
                            content: this.dialog.content,
                            sites: this.$refs.checkedSites.getCheckedNodes(true)
                        });
                        this.tableData.unshift(placard);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(placard) {
                this.dialogTitle = '编辑公告';
                this.dialog = {
                    id: placard.id,
                    content: placard.content,
                    edit: true,
                    placard: placard
                };
                if (!this.$refs.editRight) {
                    setTimeout(() => {
                        this.$refs.checkedSites.setCheckedNodes(placard.sites);
                    }, 100);
                } else {
                    this.$refs.checkedSites.setCheckedNodes(placard.sites);
                }
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {

                        let updated = await axiosPost('/platform/auth/placard/update', {
                            id: this.dialog.id,
                            content: this.dialog.content,
                            sites: this.$refs.checkedSites.getCheckedNodes(true)
                        });
                        this.dialog.placard.content = updated.content;
                        this.dialog.placard.sites = updated.sites;
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            remove(id) {
                this.$confirm('此操作将永久删除所选公告！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/placard/del/' + id);
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
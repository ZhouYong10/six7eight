<template>
    <div style="height: 100%">
        <el-button v-if="canAdd"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                height="82%">
            <el-table-column
                    label="发布日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="user.username"
                    label="发布账户"
                    :show-overflow-tooltip="true"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="可见站点"
                    min-width="84">
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
                    label="管理员可见"
                    min-width="70">
                <template slot-scope="scope">
                    {{scope.row.siteSee ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column
                    label="用户可见"
                    min-width="60">
                <template slot-scope="scope">
                    {{scope.row.userSee ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容"
                    min-width="200">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button v-if="canEdit"
                                   type="primary" size="small"
                                   @click="edit(scope.row)">编 辑</el-button>
                        <el-button v-if="canDel"
                                   type="danger" size="small"
                                   @click="remove(scope.row.id)">删 除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="text-align: center;"
                :pager-count="5"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 15, 20, 25, 30, 35, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataTotal">
        </el-pagination>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="内容" prop="content">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入内容"
                            v-model.trim="dialog.content">
                    </el-input>
                </el-form-item>
                <el-form-item label="管理员可见" prop="siteSee">
                    <el-switch v-model="dialog.siteSee"></el-switch>
                </el-form-item>
                <el-form-item label="用户可见" prop="userSee">
                    <el-switch v-model="dialog.userSee"></el-switch>
                </el-form-item>
                <el-form-item label="可见站点" prop="sites">
                    <el-tree
                            :data="sites"
                            show-checkbox
                            default-expand-all
                            :expand-on-click-node="false"
                            :check-on-click-node="true"
                            node-key="id"
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
    import {axiosGet, axiosPost} from "@/slfaxios";

    export default {
        name: "PlacardPlatform",
        async created() {
            await this.getTableData();
            this.sites = [{
                id: 0,
                name: '全部',
                children: await axiosGet('/platform/auth/sites/all')
            }];
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                sites: [],
                dialogLabelWidth: '100px',
                dialogVisible: false,
                dialogTitle: '添加公告',
                dialog: {
                    content: '',
                    siteSee: true,
                    userSee: true,
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
            async getTableData() {
                let [datas, total] = await axiosGet('/platform/auth/placards?currentPage=' +
                    this.currentPage + '&pageSize=' + this.pageSize);
                this.tableData = datas;
                this.dataTotal = total;
            },
            async handleSizeChange(size) {
                this.pageSize = size;
                await this.getTableData();
            },
            async handleCurrentChange(page) {
                this.currentPage = page;
                await this.getTableData();
            },
            cancelDialog() {
                this.dialogTitle = "添加公告";
                this.dialog = {
                    content: '',
                    siteSee: true,
                    userSee: true,
                };
                this.$refs.dialog.resetFields();
                this.$refs.checkedSites.setCheckedNodes([]);
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let placard = await axiosPost('/platform/auth/placard/add', {
                                content: this.dialog.content,
                                siteSee: this.dialog.siteSee,
                                userSee: this.dialog.userSee,
                                sites: this.$refs.checkedSites.getCheckedNodes(true)
                            });
                            this.tableData.unshift(placard);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
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
                    siteSee: placard.siteSee,
                    userSee: placard.userSee,
                    edit: true,
                    placard: placard
                };
                if (!this.$refs.checkedSites) {
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
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            let updated = await axiosPost('/platform/auth/placard/update', {
                                id: this.dialog.id,
                                content: this.dialog.content,
                                siteSee: this.dialog.siteSee,
                                userSee: this.dialog.userSee,
                                sites: this.$refs.checkedSites.getCheckedNodes(true)
                            });
                            if (updated) {
                                this.dialog.placard.content = updated.content;
                                this.dialog.placard.siteSee = updated.siteSee;
                                this.dialog.placard.userSee = updated.userSee;
                                this.dialog.placard.sites = updated.sites;
                                this.dialogVisible = false;
                            }
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
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
        },
        computed: {
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addPlacardPlatform';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editPlacardPlatform';
                });
            },
            canDel() {
                return this.$store.state.permissions.some(item => {
                    return item === 'deletePlacardPlatform';
                });
            },
        }
    }
</script>

<style lang="scss">

</style>
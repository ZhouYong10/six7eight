<template>
    <div style="height: 100%">

        <el-button v-if="canAdd" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="90%">
            <el-table-column
                    label="反馈日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="user.username"
                    label="反馈账户"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="反馈内容">
            </el-table-column>
            <el-table-column
                    label="处理日期"
                    width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.dealTime">
                        <i class="el-icon-time" style="color: #ff2525"></i>
                        <span>{{ scope.row.dealTime}}</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dealContent"
                    label="处理内容">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button v-if="canEdit" type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    <el-button v-if="canDel" type="danger" plain icon="el-icon-delete" size="small" @click="remove(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                style="text-align: center;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 15, 20, 25, 30, 35, 40]"
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
                            v-model="dialog.content">
                    </el-input>
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
        name: "Feedback",
        async created() {
            await this.getTableData();
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogLabelWidth: '60px',
                dialogVisible: false,
                dialogTitle: '添加问题反馈',
                dialog: {
                    content: ''
                },
                rules: {
                    content: [
                        {required: true, message: '请输反馈内容!', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.isDeal ? 'feedback-deal' : 'feedback-not-deal';
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/site/auth/feedbacks?currentPage=' +
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
                this.dialogTitle = "添加问题反馈";
                this.$refs.dialog.resetFields();
                this.dialog.content = '';
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let feedback = await axiosPost('/site/auth/feedback/add', this.dialog);
                        this.tableData.unshift(feedback);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(feedback) {
                this.dialogTitle = '修改问题反馈';
                this.dialog = {
                    id: feedback.id,
                    content: feedback.content,
                    edit: true,
                    feedback: feedback
                };
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let updated = await axiosPost('/site/auth/feedback/update', this.dialog);
                        this.dialog.feedback.content = updated.content;
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            remove(id) {
                this.$confirm('此操作将永久删除所选反馈！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/site/auth/feedback/del/' + id);
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
                    return item === 'addFeedbackSite';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editFeedbackSite';
                });
            },
            canDel() {
                return this.$store.state.permissions.some(item => {
                    return item === 'deleteFeedbackSite';
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-table .feedback-deal {
        background: #F0F9EB;
    }

    .el-table .feedback-not-deal {
        background: #FDF5E6;
    }
</style>
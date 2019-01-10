<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="87%">
            <el-table-column
                    label="反馈日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="user.username"
                    label="反馈账户"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="反馈内容"
                    min-width="220">
            </el-table-column>
            <el-table-column
                    label="处理日期"
                    width="155">
                <template slot-scope="scope">
                    <span v-if="scope.row.dealTime">
                        <span>{{ scope.row.dealTime}}</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    label="处理账户"
                    width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.dealUserSite">
                        {{ scope.row.dealUserSite.username}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dealContent"
                    label="处理内容"
                    min-width="220">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.isDeal && canDeal" type="primary"
                               size="small" @click="edit(scope.row)">处 理</el-button>
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

        <el-dialog title="处理反馈" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog">
                <el-form-item label="" prop="dealContent">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 10}"
                            placeholder="请输入处理内容"
                            v-model.trim="dialog.dealContent">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "UserFeedback",
        async created() {
            await this.getTableData();
            this.$options.sockets[this.siteId + 'addFeedback'] = (feedback) => {
                this.tableData.unshift(feedback);
            };
            this.$options.sockets[this.siteId + 'dealFeedback'] = (feedback) => {
                let aim = this.tableData.find(item => {
                    return item.id === feedback.id;
                });
                aim.isDeal = feedback.isDeal;
                aim.dealTime = feedback.dealTime;
                aim.dealContent = feedback.dealContent;
                aim.dealUserSite = feedback.dealUserSite;
            };
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
                dialogVisible: false,
                dialog: {
                    dealContent: ''
                },
                rules: {
                    dealContent: [
                        {required: true, message: '请输处理内容!', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.isDeal ? 'feedback-deal' : 'feedback-not-deal';
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/site/auth/user/feedbacks?currentPage=' +
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
                this.dialog = {
                    dealContent: ''
                };
                this.$refs.dialog.resetFields();
            },
            edit(feedback) {
                this.dialog.feedback = feedback;
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            await axiosPost('/site/auth/user/feedback/deal', this.dialog);
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
            siteId() {
                return this.$store.state.siteId;
            },
            canDeal() {
                return this.$store.state.permissions.some(item => {
                    return item === 'dealFeedbackUserSite';
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
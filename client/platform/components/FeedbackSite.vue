<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="反馈日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="site.name"
                    label="所属分站"
                    width="120">
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
                    label="处理账户"
                    width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.dealUser">
                        {{ scope.row.dealUser.username}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dealContent"
                    label="处理内容">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="90">
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.dealContent" type="primary" plain icon="el-icon-edit"
                               size="small" @click="edit(scope.row)">处 理</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="处理反馈" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="内容" prop="dealContent">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入处理内容"
                            v-model="dialog.dealContent">
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
            this.tableData = await axiosGet('/platform/auth/site/feedbacks');
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '60px',
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
            cancelDialog() {
                this.$refs.dialog.resetFields();
                this.dialog.dealContent = '';
            },
            edit(feedback) {
                this.dialog.feedback = feedback;
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let updated = await axiosPost('/platform/auth/site/feedback/deal', this.dialog);
                        this.dialog.feedback.dealTime = updated.dealTime;
                        this.dialog.feedback.dealContent = updated.dealContent;
                        this.dialog.feedback.dealUser = updated.dealUser;
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss">

</style>
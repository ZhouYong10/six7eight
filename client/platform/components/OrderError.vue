<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="报错日期"
                    min-width="170">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="报错内容"
                    min-width="200">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="60">
                <template slot-scope="scope">
                    {{scope.row.isDeal ? '已处理' : '未处理'}}
                </template>
            </el-table-column>
            <el-table-column
                    label="处理日期"
                    min-width="170">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.dealTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dealContent"
                    label="处理内容"
                    min-width="200">
            </el-table-column>
            <el-table-column
                    label="处理账户"
                    min-width="60">
                <template slot-scope="scope">
                    {{scope.row.userAdmin ? scope.row.userAdmin.username : ''}}
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button v-if="canDeal" type="primary" plain icon="el-icon-edit"
                               size="small" @click="dealError(scope.row)">处 理</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="处理订单报错" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" label-width="60px">
                <el-form-item label="内容" prop="dealContent">
                    <el-input type="textarea" :rows="3" v-model="dialog.dealContent" placeholder="请输入处理内容！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";
    import {isNum} from "@/validaters";

    export default {
        name: "OrderError",
        async created() {
            this.tableData = await axiosGet('/platform/auth/all/order/errors');
        },
        sockets: {
            addOrderError(error) {
                this.tableData.unshift(error);
            }
        },
        data() {
            return {
                tableData: [],
                dialogVisible: false,
                dialog: {
                    dealContent: ''
                },
                dialogRules: {
                    dealContent: [
                        {required: true, message: '请输入处理内容！', trigger: 'blur'},
                        {max: 160, message: '备注内容不能超过160个字符！', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.isDeal ? 'already-deal' : 'wait_deal';
            },
            dealError(error) {
                this.dialog = {
                    dealContent: '',
                    id: error.id
                };
                this.dialogVisible = true;
            },
            cancelDialog() {
                this.dialog = {
                    dealContent: ''
                };
                this.$refs.dialog.resetFields();
            },
            submit() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/platform/auth/order/deal/error', this.dialog);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            canDeal() {
                return this.$store.state.permissions.some(item => {
                    return item === 'dealOrderErrorPlatform';
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-table .already-deal {
        background: #F0F9EB;
    }

    .el-table .wait_deal {
        background: #FDF5E6;
    }
</style>
<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="提交日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="处理日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.dealTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="alipayCount"
                    label="支付宝账户"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="alipayName"
                    label="支付宝实名"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="oldFunds"
                    label="之前余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="funds"
                    label="提现金额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="newFunds"
                    label="之后余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'wait_withdraw'">提现中</span>
                    <span v-else-if="scope.row.state === 'success_withdraw'">已到账</span>
                    <span v-else="scope.row.state === 'fail_withdraw'">失败</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="failMsg"
                    label="失败信息"
                    :show-overflow-tooltip="true"
                    min-width="80">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "WithdrawRecord",
        async created() {
            this.tableData = await axiosGet('/user/auth/withdraw/records');
        },
        data() {
            return {
                tableData: [],
            }
        },
        methods: {
            tableRowClassName({row}) {
                switch (row.state){
                    case 'wait_withdraw':
                        return 'wait_withdraw';
                    case 'success_withdraw':
                        return 'success_withdraw';
                    default:
                        return 'fail_withdraw';
                }
            }
        },
    }
</script>

<style lang="scss">
    .el-table .success_withdraw {
        background: #F0F9EB;
    }

    .el-table .wait_withdraw {
        background: #FDF5E6;
    }

    .el-table .fail_withdraw {
        background: #FEF0F0;
    }
</style>
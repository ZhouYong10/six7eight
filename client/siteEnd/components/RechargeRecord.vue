<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    prop="userSite.username"
                    label="充值账户"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="提交日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="到账日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.intoAccountTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="alipayCount"
                    label="支付宝"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="alipayId"
                    label="交易号"
                    min-width="280">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.isDone ? '已到账' : '充值中'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="userOldFunds"
                    label="之前余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="funds"
                    label="充值金额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="userNewFunds"
                    label="之后余额"
                    min-width="100">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "RechargeRecord",
        async created() {
            this.tableData = await axiosGet('/site/auth/recharge/records');
        },
        data() {
            return {
                tableData: [],
            }
        },
        methods: {
            tableRowClassName({row}) {
                if (row.isDone) {
                    return 'success';
                } else {
                    return 'recharging';
                }
            }
        },
    }
</script>

<style lang="scss">
    .el-table .success {
        background: #F0F9EB;
    }

    .el-table .recharging {
        background: #FEF0F0;
    }
</style>
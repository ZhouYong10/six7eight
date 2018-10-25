<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="充值类型"
                    min-width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.type === 'site_recharge' ? '站点充值' : '用户充值'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="site.name"
                    label="所属分站"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="充值账户"
                    min-width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.user ? scope.row.user.username : scope.row.userSite.username}}</span>
                </template>
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
                    <span>{{ scope.row.isDone ? '已到账' : '待充值'}}</span>
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
        name: "Recharges",
        async created() {
            this.tableData = await axiosGet('/platform/auth/recharge/records');
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
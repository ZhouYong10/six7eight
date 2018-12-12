<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="oldFunds"
                    label="之前余额"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    label="金额"
                    min-width="80">
                <template slot-scope="scope">
                    <i v-if="scope.row.upOrDown === 'plus_consume'" class="el-icon-plus" style="color: #004eff"></i>
                    <i v-else class="el-icon-minus" style="color: #ff2525"></i>
                    <span>{{ scope.row.funds}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="newFunds"
                    label="之后余额"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述"
                    :show-overflow-tooltip="true"
                    min-width="220">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "ConsumeRecord",
        async created() {
            this.tableData = await axiosGet('/user/auth/consume/records');
        },
        data() {
            return {
                tableData: [],
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.state;
            }
        },
    }
</script>

<style lang="scss">
    .el-table .plus_consume {
        background: #F0F9EB;
    }
    .el-table .minus_consume {
        background: #FEF0F0;
    }
</style>
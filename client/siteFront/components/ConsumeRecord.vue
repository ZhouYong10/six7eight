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
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="userOldFunds"
                    label="之前余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="funds"
                    label="金额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="userNewFunds"
                    label="之后余额"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述"
                    :show-overflow-tooltip="true"
                    min-width="180">
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
            tableRowClassName() {
                return 'consume_record';
            }
        },
    }
</script>

<style lang="scss">
    .el-table .consume_record {
        background: #F0F9EB;
    }
</style>
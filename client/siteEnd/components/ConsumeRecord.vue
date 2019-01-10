<template>
    <div style="height: 100%">
        <el-radio-group v-model="chooseType"  size="small" @change="typeChoosed">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="充值"></el-radio-button>
            <el-radio-button label="提现"></el-radio-button>
            <el-radio-button label="消费"></el-radio-button>
            <el-radio-button label="返利"></el-radio-button>
        </el-radio-group>
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="82%">
            <el-table-column
                    label="日期"
                    :show-overflow-tooltip="true"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="baseFunds"
                    label="成本"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="oldFunds"
                    label="之前利润"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="金额"
                    min-width="110">
                <template slot-scope="scope">
                    <i v-if="scope.row.upOrDown === 'plus_consume'" class="fa fa-plus" style="color: #000; font-size: 10px;"></i>
                    <i v-else class="fa fa-minus" style="color: #ff2525; font-size: 10px;"></i>
                    <span>{{ scope.row.funds}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="newFunds"
                    label="之后利润"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述"
                    min-width="200">
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

    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "ConsumeRecord",
        async created() {
            await this.getTableData();
        },
        data() {
            return {
                chooseType: '全部',
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.upOrDown;
            },
            async typeChoosed() {
                this.currentPage = 1;
                await this.getTableData();
            },
            async getTableData() {
                let [datas, total] = await axiosGet('/site/auth/all/funds/records/'+this.chooseType+'?currentPage=' +
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
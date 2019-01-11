<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                height="87%">
            <el-table-column
                    label="发布日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="site.name"
                    label="所属分站"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容"
                    min-width="220">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button v-if="canDel"
                               type="danger" size="small"
                               @click="remove(scope.row.id)">删 除</el-button>
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
    </div>
</template>

<script>
    import {axiosGet} from "@/slfaxios";

    export default {
        name: "PlacardSite",
        async created() {
            await this.getTableData();
        },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                dataTotal: 0,
            }
        },
        methods: {
            async getTableData() {
                let [datas, total] = await axiosGet('/platform/auth/sites/placards?currentPage=' +
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
            remove(id) {
                this.$confirm('此操作将永久删除所选公告！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/site/placard/del/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
        computed: {
            canDel() {
                return this.$store.state.permissions.some(item => {
                    return item === 'deletePlacardSitePlatform';
                });
            },
        }
    }
</script>

<style lang="scss">

</style>
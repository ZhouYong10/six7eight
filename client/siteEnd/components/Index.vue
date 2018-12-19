<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                height="100%">
            <el-table-column
                    label="发布日期"
                    :show-overflow-tooltip="true"
                    min-width="120">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="公告内容"
                    min-width="300">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "Placards",
        async created() {
            this.tableData = await axiosGet('/site/auth/platform/placards');
            this.$options.sockets[this.siteId + 'addPlacardToSiteAdmin'] = (placard) => {
                this.tableData.unshift(placard);
            };
            this.$options.sockets[this.siteId + 'editPlacardToSiteAdmin'] = (placard) => {
                let aim = this.tableData.find(item => {
                    return item.id === placard.id;
                });
                aim.content = placard.content;
            };
        },
        data() {
            return {
                tableData: [],
            }
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            }
        }
    }
</script>

<style lang="scss">

</style>
<template>
    <div style="height: 100%">

        <el-table
                :data="tableData">
            <el-table-column
                    label="发布日期"
                    min-width="176">
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

        <el-row type="flex" justify="center">
            <el-col :sm="24" :md="18" :lg="10">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <span>卡片名称</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "Placards",
        async created() {
            this.tableData = await axiosGet('/user/all/placards');

            this.$options.sockets[this.siteId + 'addPlacardToFrontUser'] = (placard) => {
                this.tableData.unshift(placard);
            };
            this.$options.sockets[this.siteId + 'editPlacardToFrontUser'] = (placard) => {
                let aim = this.tableData.find(item => {
                    return item.id === placard.id;
                });
                if (aim) {
                    aim.content = placard.content;
                }
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
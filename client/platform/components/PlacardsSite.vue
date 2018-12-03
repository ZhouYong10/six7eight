<template>
    <div style="height: 100%">

        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="发布日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="site.name"
                    label="所属分站"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="90">
                <template slot-scope="scope">
                    <el-button v-if="canDel" type="danger" plain icon="el-icon-delete" size="small" @click="remove(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "PlacardSite",
        async created() {
            this.tableData = await axiosGet('/platform/auth/sites/placards');
        },
        data() {
            return {
                tableData: []
            }
        },
        methods: {
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
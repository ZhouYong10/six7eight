<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 66px;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="开户日期"
                    min-width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.registerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="最后登录日期"
                    min-width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.lastLoginTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="账户名"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="状态"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="role.name"
                    label="角色"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="电话"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="qq"
                    label="QQ"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="weixin"
                    label="微信"
                    min-width="130">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="Email"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="188">
                <template slot-scope="scope">

                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "Sites",
        async created() {
            let res = await axiosGet('/platform/auth/admins');
            this.tableData = res.data;
        },
        data() {
            return {
                tableData: []
            }
        },
        methods: {
            tableRowClassName({row}) {
                switch (row.state){
                    case '正常':
                        return 'normal-row';
                    case '冻结':
                        return 'freeze-row';
                    default:
                        return 'ban-row';
                }
            },
            handleClick(row) {
                console.log(row);
            }
        },
    }
</script>

<style lang="scss">
    .el-table .normal-row {
        background: #F0F9EB;
    }

    .el-table .freeze-row {
        background: #FDF5E6;
    }

    .el-table .ban-row {
        background: #FEF0F0;
    }

</style>
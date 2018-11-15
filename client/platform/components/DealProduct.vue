<template>
    <div style="height: 100%">
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="下单日期"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="表单内容"
                    min-width="80">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            width="500"
                            trigger="click">
                        <div v-for="(item, key) in scope.row.fields">
                            <p v-if="key.search('file') !== -1">
                                {{item.name}}: <img style="width: 100px; height: 100px;" :src="item.value" :alt="item.name"/>
                            </p>
                            <p v-else>
                                {{item.name}}: {{item.value}}
                            </p>
                        </div>
                        <el-button slot="reference">表单内容</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="单价"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="totalPrice"
                    label="总价"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="startNum"
                    label="初始量"
                    min-width="70">
            </el-table-column>
            <el-table-column
                    prop="progress"
                    label="进度"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 'order_wait'">待执行</span>
                    <span v-if="scope.row.status === 'order_execute'">执行中</span>
                    <span v-if="scope.row.status === 'order_finish'">已完成</span>
                    <span v-if="scope.row.status === 'order_refund'">已退款</span>
                </template>
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="editUser(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="delUser(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {axiosGet, axiosPost, getProductUserPrice, host} from "@/utils";
    import {isInteger, isUrl} from "@/validaters";
    import Vue from "vue";

    export default {
        name: "DealProduct",
        props: ['id'],
        async created() {
            this.changeTableData(this.id);
        },
        data() {
            return {
                tableData: []
            }
        },
        watch: {
            id: function(val){
                this.changeTableData(val);
            }
        },
        methods: {
            async changeTableData(productId) {
                this.tableData = await axiosGet('/platform/auth/orders/' + productId);
            },
            tableRowClassName({row}) {
                switch (row.status){
                    case 'order_wait':
                        return 'order_wait';
                    case 'order_execute':
                        return 'order_execute';
                    case 'order_finish':
                        return 'order_finish';
                    case 'order_refund':
                        return 'order_refund';
                }
            },
        },
    }
</script>

<style lang="scss">
    .el-table .order_execute {
        background: #F0F9EB;
    }

    .el-table .order_wait {
        background: #FDF5E6;
    }

    .el-table .order_refund {
        background: #FEF0F0;
    }
</style>
<template>
    <div style="height: 100%">
        <sf-reminder title="提示">
            升级优点：　升级代理后下单价格更低，发展下级代理可赚取差价；下级代理升级，有分成。<br/>
            升级价格：　升级到{{roleSuper}}，升级费用(扣除) ￥{{goldUpPrice}}元；
            升级到{{roleTop}}，升级费用(扣除) ￥{{superUpPrice}}元。<br/>
            <span class="tip">升级规则：　代理只能逐级升级，不能跳级升级。</span><br/>
        </sf-reminder>

        <el-button v-if="roleType !== 'role_top' && canRoleUp"
                   size="small" type="success" icon="el-icon-upload2"
                   @click="upRole">升 级</el-button>

        <el-table
                :data="tableData"
                :span-method="spanMethod"
                height="100%">
            <el-table-column
                    prop="typeName"
                    label="业务类别"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="业务名称"
                    min-width="120">
            </el-table-column>
            <el-table-column
                    :class-name="roleType === 'role_top' ? 'active_price' : ''"
                    prop="topPrice"
                    :label="roleTop"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    :class-name="roleType === 'role_super' ? 'active_price' : ''"
                    prop="superPrice"
                    :label="roleSuper"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    :class-name="roleType === 'role_gold' ? 'active_price' : ''"
                    prop="goldPrice"
                    :label="roleGold"
                    min-width="100">
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "RoleUp",
        async beforeCreate() {
            let data = await axiosGet('/user/all/products/price');
            this.tableData = data.products;
            this.roles = data.priceRoles;
            this.goldUpPrice = data.goldUpPrice;
            this.superUpPrice = data.superUpPrice;
        },
        data() {
            return {
                tableData: [],
                roles: [],
                goldUpPrice: 0,
                superUpPrice: 0,
            }
        },
        methods: {
            spanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0) {
                    if (row.nums) {
                        return {rowspan: row.nums, colspan: 1};
                    }else {
                        return {rowspan: 0, colspan: 0};
                    }
                }
            },
            async upRole() {
                this.$confirm('是否确认升级?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let data = await axiosGet('/user/auth/up/role/' + this.userId);
                    if (data) {
                        this.$store.commit('userUpRole', data);
                    }
                }).catch(() => {

                });
            }
        },
        computed: {
            roleTop() {
                let role = this.roles.find(role => {
                    return role.type === 'role_top';
                });
                return role ? role.name : '';
            },
            roleSuper() {
                let role = this.roles.find(role => {
                    return role.type === 'role_super';
                });
                return role ? role.name : '';
            },
            roleGold() {
                let role = this.roles.find(role => {
                    return role.type === 'role_gold';
                });
                return role ? role.name : '';
            },
            roleType() {
                return this.$store.state.roleType;
            },
            canRoleUp() {
                return this.$store.state.permissions.some(item => {
                    return item === 'canRoleUpUser';
                });
            },
            userId() {
                return this.$store.state.userId;
            }
        }
    }
</script>

<style lang="scss">
    .active_price{
        color: red;
    }
</style>
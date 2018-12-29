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

        <el-row :gutter="6" v-if="isLogin">
            <el-col :sm="24" :md="24" :lg="11">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                style="max-width: 130px;"
                                v-model="userDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                                @change="loadPlatStatisticsBaseInfo"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="loadPlatStatisticsBaseInfo"> 刷新</el-button>
                    </div>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <p><span>充值: ￥</span><span>{{statisticsData.recharge}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>提现: ￥</span><span>{{statisticsData.withdraw}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>新增下级: </span><span>{{statisticsData.lowerUser}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>下级升级: </span><span>{{statisticsData.lowerUserUpRole}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>消费: ￥</span><span>{{statisticsData.consume}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>返利: ￥</span><span>{{statisticsData.profit}}</span></p>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="24" :lg="13">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                style="max-width: 130px;"
                                v-model="orderDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                                @change="loadOrdersInfo"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="loadOrdersInfo"> 刷新</el-button>
                    </div>
                    <el-table
                            :data="statisticsData.orderInfo"
                            height="360"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="业务名称"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                prop="orderNum"
                                label="订单个数"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                prop="totalNum"
                                label="下单总数"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                prop="executeNum"
                                label="执行总数"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="下单总额"
                                min-width="120">
                            <template slot-scope="scope">
                                ￥<span>{{scope.row.totalFunds}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="交易总额"
                                min-width="120">
                            <template slot-scope="scope">
                                ￥<span>{{scope.row.executeFunds}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {axiosGet, today} from "@/utils";

    export default {
        name: "Placards",
        async created() {
            this.tableData = await axiosGet('/user/all/placards');

            this.$options.sockets[this.siteId + 'addPlacardToFrontUser'] = (placard) => {
                if (this.tableData.length >= 6) {
                    if ('userSee' in placard) {
                        this.tableData.splice(2, 1);
                        this.tableData.unshift(placard);
                    }else{
                        this.tableData.splice(5, 1);
                        this.tableData.splice(3, 0, placard);
                    }
                }else{
                    this.tableData.unshift(placard);
                }
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
                statisticsData: {
                    orderInfo: [],
                    recharge: 0,
                    withdraw: 0,
                    lowerUser: 0,
                    lowerUserUpRole: 0,
                    consume: 0,
                    profit: 0,
                },
                orderDate: today(),
                userDate: today(),
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                }
            }
        },
        methods: {
            async loadOrdersInfo() {
                this.statisticsData.orderInfo = await axiosGet('/user/auth/get/order/count/data/' + this.orderDate);
            },
            async loadPlatStatisticsBaseInfo() {
                let result = await axiosGet('/user/auth/load/platform/statistics/base/info/' + this.userDate);
                this.statisticsData.recharge = result.recharge;
                this.statisticsData.withdraw = result.withdraw;
                this.statisticsData.lowerUser = result.lowerUser;
                this.statisticsData.lowerUserUpRole = result.lowerUserUpRole;
                this.statisticsData.consume = result.consume;
                this.statisticsData.profit = result.profit;
            },
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            },
            isLogin() {
                return this.$store.state.userId;
            }
        }
    }
</script>

<style lang="scss">

</style>
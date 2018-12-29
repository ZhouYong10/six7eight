<template>
    <div style="height: 100%">
        <el-row>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                <el-button type="primary" size="small" icon="fa fa-refresh" @click="loadFundsAndUserInfo"> 刷新</el-button>
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                总余额: ￥{{statisticsData.funds}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                总冻结: ￥{{statisticsData.freezeFunds}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                正常用户: {{statisticsData.normal}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                冻结用户: {{statisticsData.freeze}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                封禁用户: {{statisticsData.ban}}
            </div></el-col>
        </el-row>
        <hr/>
        <el-row :gutter="6">
            <el-col :sm="24" :md="24" :lg="10">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
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
            <el-col :sm="24" :md="24" :lg="6">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                style="max-width: 130px;"
                                v-model="platDate"
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
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>平台成本: ￥</span><span>{{statisticsData.platDayBaseFunds}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>平台利润: ￥</span><span>{{statisticsData.platDayProfit}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>新增用户: </span><span>{{statisticsData.platDayUser}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>升级账户: </span><span>{{statisticsData.platDayUserUpRole}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>充值金额: ￥</span><span>{{statisticsData.platDayRecharge}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>提现金额: ￥</span><span>{{statisticsData.platDayWithdraw}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>自营下单: ￥</span><span>{{statisticsData.platDayOrderFunds}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>自营交易: ￥</span><span>{{statisticsData.platDayOrderExecuteFunds}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>分站下单: ￥</span><span>{{statisticsData.siteDayOrderFunds}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>分站交易: ￥</span><span>{{statisticsData.siteDayOrderExecuteFunds}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>分站成本: ￥</span><span>{{statisticsData.platDaySiteBaseFunds}}</span></p>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="24">
                            <p><span>分站提成: ￥</span><span>{{statisticsData.platDaySiteProfit}}</span></p>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="24" :lg="8">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                v-model="siteDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="freshData"> 刷新</el-button>
                    </div>
                    <p><span>今日下单: </span><span></span></p>
                    <p><span>今日撤单: </span><span></span></p>
                    <p><span>今日成本: </span><span></span></p>
                    <p><span>今日利润: </span><span></span></p>
                    <p><span>新增用户: </span><span></span></p>
                    <p><span>今日充值: </span><span></span></p>
                    <p><span>今日提现: </span><span></span></p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {axiosGet, today} from "@/utils";

    export default {
        name: "PlatformIndex",
        async created() {
            // this.statisticsData = await axiosGet('/platform/auth/get/total/count/data')
            // await this.loadFundsAndUserInfo();
            // await this.loadOrdersInfo();
        },
        data() {
            return {
                statisticsData: {
                    funds: 0,
                    freezeFunds: 0,
                    normal: 0,
                    freeze: 0,
                    ban: 0,
                    orderInfo: [],
                    platDayBaseFunds: 0,
                    platDayProfit: 0,
                    platDayUser: 0,
                    platDayUserUpRole: 0,
                    platDayRecharge: 0,
                    platDayWithdraw: 0,
                    platDayOrderFunds: 0,
                    platDayOrderExecuteFunds: 0,
                    siteDayOrderFunds: 0,
                    siteDayOrderExecuteFunds: 0,
                    platDaySiteBaseFunds: 0,
                    platDaySiteProfit: 0,
                },
                orderDate: today(),
                platDate: today(),
                siteDate: today(),
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                }
            }
        },
        methods: {
            async loadFundsAndUserInfo() {
                let result = await axiosGet('/platform/auth/get/total/funds/users/info');
                this.statisticsData.funds = result.funds;
                this.statisticsData.freezeFunds = result.freezeFunds;
                this.statisticsData.normal = result.normal;
                this.statisticsData.freeze = result.freeze;
                this.statisticsData.ban = result.ban;
            },
            async loadOrdersInfo() {
                this.statisticsData.orderInfo = await axiosGet('/platform/auth/get/order/count/data/' + this.orderDate);
            },
            async loadPlatStatisticsBaseInfo() {
                let result = await axiosGet('/platform/auth/load/platform/statistics/base/info/' + this.platDate);
                this.statisticsData.platDayBaseFunds = result.platDayBaseFunds;
                this.statisticsData.platDayProfit = result.platDayProfit;
                this.statisticsData.platDayUser = result.platDayUser;
                this.statisticsData.platDayUserUpRole = result.platDayUserUpRole;
                this.statisticsData.platDayRecharge = result.platDayRecharge;
                this.statisticsData.platDayWithdraw = result.platDayWithdraw;
                this.statisticsData.platDayOrderFunds = result.platDayOrderFunds;
                this.statisticsData.platDayOrderExecuteFunds = result.platDayOrderExecuteFunds;
                this.statisticsData.siteDayOrderFunds = result.siteDayOrderFunds;
                this.statisticsData.siteDayOrderExecuteFunds = result.siteDayOrderExecuteFunds;
                this.statisticsData.platDaySiteBaseFunds = result.platDaySiteBaseFunds;
                this.statisticsData.platDaySiteProfit = result.platDaySiteProfit;
            },
            freshData() {

            }
        }
    }
</script>

<style scoped>
    .base-info {
        line-height: 36px;

    }
</style>
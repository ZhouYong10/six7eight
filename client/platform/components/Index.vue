<template>
    <div style="height: 100%;padding: 0 6px;">
        <el-row>
            <el-col>
                清除 <el-input-number v-model="day" size="small" controls-position="right" :min="0" :step="1"></el-input-number> 天前数据
                <el-button type="primary" size="small" @click="clearDatas">确定</el-button>
            </el-col>
        </el-row>
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
        <el-row :gutter="12">
            <el-col :sm="24" :md="24" :lg="11">
                <el-card class="index-fundsCount">
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
                    <ul>
                        <li>
                            <el-row :gutter="6">
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>平台成本: ￥</span><span>{{statisticsData.platDayBaseFunds}}</span></p>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>平台利润: ￥</span><span>{{statisticsData.platDayProfit}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="6">
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>新增用户: </span><span>{{statisticsData.platDayUser}}</span></p>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>升级账户: </span><span>{{statisticsData.platDayUserUpRole}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="6">
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>充值金额: ￥</span><span>{{statisticsData.platDayRecharge}}</span></p>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>提现金额: ￥</span><span>{{statisticsData.platDayWithdraw}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="6">
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>自营下单: ￥</span><span>{{statisticsData.platDayOrderFunds}}</span></p>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>自营交易: ￥</span><span>{{statisticsData.platDayOrderExecuteFunds}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="6">
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>分站下单: ￥</span><span>{{statisticsData.siteDayOrderFunds}}</span></p>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>分站交易: ￥</span><span>{{statisticsData.siteDayOrderExecuteFunds}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="6">
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>分站成本: ￥</span><span>{{statisticsData.platDaySiteBaseFunds}}</span></p>
                                </el-col>
                                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                                    <p><span>分站提成: ￥</span><span>{{statisticsData.platDaySiteProfit}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                </el-card>
                <el-card class="index-siteCount">
                    <div slot="header" class="clearfix">
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   @click="loadPlatStatisticsSites"> 刷新</el-button>
                    </div>
                    <p class="site-info"
                       v-for="site in statisticsData.sites"
                       @click="openDialogOfSite(site)">
                        <span class="site-name">{{site.name}}</span>
                        &nbsp;&nbsp;
                        余额: ￥<span class="site-funds">{{site.funds}}</span>
                        &nbsp;&nbsp;
                        冻结: ￥<span class="site-freezeFunds">{{site.freezeFunds}}</span>
                    </p>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="24" :lg="13">
                <el-card class="index-orderCount">
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
                            header-row-class-name="table-header"
                            :data="statisticsData.orderInfo"
                            max-height="700">
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
        <el-dialog :title="dialogTitle" :visible.sync="siteVisible" top="3vh" width="86%" @closed="cancelSite">
            <el-row>
                <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                    <el-button type="primary" size="small" icon="fa fa-refresh" @click="loadSiteFundsAndUserInfo"> 刷新</el-button>
                </div></el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                    总余额: ￥{{siteStatistics.funds}}
                </div></el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                    总冻结: ￥{{siteStatistics.freezeFunds}}
                </div></el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                    正常用户: {{siteStatistics.normal}}
                </div></el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                    冻结用户: {{siteStatistics.freeze}}
                </div></el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                    封禁用户: {{siteStatistics.ban}}
                </div></el-col>
            </el-row>
            <hr/>
            <el-row :gutter="6">
                <el-col :sm="24" :md="24" :lg="11">
                    <el-card class="box-card" style="margin-top: 12px;">
                        <div slot="header" class="clearfix">
                            <el-date-picker
                                    style="max-width: 130px;"
                                    v-model="siteBaseDate"
                                    type="date"
                                    size="small"
                                    :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd"
                                    @change="loadSiteStatisticsBaseInfo"
                                    placeholder="选择日期">
                            </el-date-picker>
                            <el-button size="small" type="success" icon="fa fa-refresh"
                                       style="float: right;"
                                       @click="loadSiteStatisticsBaseInfo"> 刷新</el-button>
                        </div>
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <p><span>站点成本: ￥</span><span>{{siteStatistics.siteDayBaseFunds}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span>站点利润: ￥</span><span>{{siteStatistics.siteDayProfit}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span>新增用户: </span><span>{{siteStatistics.siteDayUser}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span>升级账户: </span><span>{{siteStatistics.siteDayUserUpRole}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span>自营下单: ￥</span><span>{{siteStatistics.siteDayOrderFunds}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span>自营交易: ￥</span><span>{{siteStatistics.siteDayOrderExecuteFunds}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span>平台下单: ￥</span><span>{{siteStatistics.platDayOrderFunds}}</span></p>
                            </el-col>
                            <el-col :span="12">
                                <p><span>平台交易: ￥</span><span>{{siteStatistics.platDayOrderExecuteFunds}}</span></p>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
                <el-col :sm="24" :md="24" :lg="13">
                    <el-card class="box-card" style="margin-top: 12px;">
                        <div slot="header" class="clearfix">
                            <el-date-picker
                                    style="max-width: 130px;"
                                    v-model="siteOrderDate"
                                    type="date"
                                    size="small"
                                    :picker-options="pickerOptions"
                                    value-format="yyyy-MM-dd"
                                    @change="loadSiteOrdersInfo"
                                    placeholder="选择日期">
                            </el-date-picker>
                            <el-button size="small" type="success" icon="fa fa-refresh"
                                       style="float: right;"
                                       @click="loadSiteOrdersInfo"> 刷新</el-button>
                        </div>
                        <el-table
                                :data="siteStatistics.orderInfo"
                                height="380"
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
        </el-dialog>
    </div>
</template>

<script>
    import {today} from "@/utils";
    import {axiosGet} from "@/slfaxios";

    export default {
        name: "PlatformIndex",
        async created() {
            this.statisticsData = await axiosGet('/platform/auth/get/total/statistics/data')
        },
        data() {
            return {
                day: 30,
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                orderDate: today(),
                platDate: today(),
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
                    sites: [],
                },
                siteVisible: false,
                dialogTitle: '',
                siteStatistics: {
                    funds: 0,
                    freezeFunds: 0,
                    normal: 0,
                    freeze: 0,
                    ban: 0,
                    siteDayBaseFunds: 0,
                    siteDayProfit: 0,
                    siteDayUser: 0,
                    siteDayUserUpRole: 0,
                    siteDayOrderFunds: 0,
                    siteDayOrderExecuteFunds: 0,
                    platDayOrderFunds: 0,
                    platDayOrderExecuteFunds: 0,
                    orderInfo: [],
                },
                siteBaseDate: today(),
                siteOrderDate: today(),
            }
        },
        methods: {
            async clearDatas() {
                this.$confirm('数据清除后将不可回复，是否确认！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/clear/datas/' + this.day + '/days/ago');
                    this.$message({
                        message: '清除数据成功！',
                        type: 'success'
                    });
                }).catch((e) => {
                    console.log(e);
                });
            },
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
            async loadPlatStatisticsSites() {
                this.statisticsData.sites = await axiosGet('/platform/auth/statistics/of/sites');
            },
            async openDialogOfSite(site) {
                this.dialogTitle = site.name;
                this.siteStatistics = await axiosGet(`/platform/auth/get/statistics/of/site/${site.id}`);
                this.siteStatistics.id = site.id;
                this.siteVisible = true;
            },
            cancelSite() {
                this.siteStatistics = {
                    funds: 0,
                    freezeFunds: 0,
                    normal: 0,
                    freeze: 0,
                    ban: 0,
                    siteDayBaseFunds: 0,
                    siteDayProfit: 0,
                    siteDayUser: 0,
                    siteDayUserUpRole: 0,
                    siteDayOrderFunds: 0,
                    siteDayOrderExecuteFunds: 0,
                    platDayOrderFunds: 0,
                    platDayOrderExecuteFunds: 0,
                    orderInfo: [],
                };
                this.siteBaseDate = today();
                this.siteOrderDate = today();
            },
            async loadSiteFundsAndUserInfo() {
                let result = await axiosGet(`/platform/auth/get/total/funds/users/info/of/${this.siteStatistics.id}`);
                this.siteStatistics.funds = result.funds;
                this.siteStatistics.freezeFunds = result.freezeFunds;
                this.siteStatistics.normal = result.normal;
                this.siteStatistics.freeze = result.freeze;
                this.siteStatistics.ban = result.ban;
            },
            async loadSiteStatisticsBaseInfo() {
                let result = await axiosGet(`/platform/auth/load/site/${this.siteStatistics.id}/statistics/base/info/${this.siteBaseDate}`);
                this.siteStatistics.siteDayBaseFunds = result.siteDayBaseFunds;
                this.siteStatistics.siteDayProfit = result.siteDayProfit;
                this.siteStatistics.siteDayUser = result.siteDayUser;
                this.siteStatistics.siteDayUserUpRole = result.siteDayUserUpRole;
                this.siteStatistics.siteDayOrderFunds = result.siteDayOrderFunds;
                this.siteStatistics.siteDayOrderExecuteFunds = result.siteDayOrderExecuteFunds;
                this.siteStatistics.platDayOrderFunds = result.platDayOrderFunds;
                this.siteStatistics.platDayOrderExecuteFunds = result.platDayOrderExecuteFunds;
            },
            async loadSiteOrdersInfo() {
                this.siteStatistics.orderInfo =
                    await axiosGet(`/platform/auth/get/order/count/data/of/${this.siteStatistics.id}/${this.siteOrderDate}`);
            },

        }
    }
</script>

<style lang="scss">
    .base-info {
        line-height: 36px;
    }
    .index-fundsCount{
        margin-top: 12px;
        box-shadow: 0 6px 12px 0 rgba(0,0,0,.4)!important;
        .el-card__header{
            padding: 14px;
            background: #ebeef5;
        }
        .el-card__body{
            padding: 6px;
        }
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            li{
                border-bottom: 1px solid #dbe0de;
                color: #004bbb;
            }
        }
    }
    .index-siteCount{
        margin-top: 12px;
        box-shadow: 0 6px 12px 0 rgba(0,0,0,.4)!important;
        .el-card__header{
            padding: 14px;
            background: #ebeef5;
        }
        .el-card__body{
            padding: 6px;
            max-height: 308px;
            overflow: auto;
        }
        .site-info{
            margin: 0;
            padding: 15px;
            border-bottom: 1px solid #dbe0de;
            cursor: pointer;
        }
        .site-info:hover {
            color: #409EFF;
        }
    }
    .index-orderCount{
        margin-top: 12px;
        box-shadow: 0 6px 12px 0 rgba(0,0,0,.4)!important;
        .el-card__header{
            padding: 14px;
            background: #ebeef5;
        }
        .el-card__body{
            padding: 6px;
        }
        .table-header{
            color: #259ba0;
        }
    }
</style>
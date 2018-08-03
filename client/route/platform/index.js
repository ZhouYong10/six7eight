"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Login_vue_1 = require("../../components/platform/login/Login.vue");
const NoPage_vue_1 = require("../../components/commons/NoPage.vue");
const Index_vue_1 = require("../../components/platform/Index.vue");
const Home_vue_1 = require("../../components/platform/Home.vue");
const AdminInfo_vue_1 = require("../../components/platform/AdminInfo.vue");
const OrderError_vue_1 = require("../../components/platform/OrderError.vue");
const Recharge_vue_1 = require("../../components/platform/Recharge.vue");
const Withdraw_vue_1 = require("../../components/platform/Withdraw.vue");
const ProudctsTypes_vue_1 = require("../../components/platform/ProudctsTypes.vue");
const ProudctsAll_vue_1 = require("../../components/platform/ProudctsAll.vue");
const PlacardsPlatform_vue_1 = require("../../components/platform/PlacardsPlatform.vue");
const PlacardsSite_vue_1 = require("../../components/platform/PlacardsSite.vue");
const Sites_vue_1 = require("../../components/platform/Sites.vue");
const FeedbackSite_vue_1 = require("../../components/platform/FeedbackSite.vue");
const FeedbackUser_vue_1 = require("../../components/platform/FeedbackUser.vue");
const AdminsRole_vue_1 = require("../../components/platform/AdminsRole.vue");
const AdminsList_vue_1 = require("../../components/platform/AdminsList.vue");
const routes = [
    { path: '*', component: NoPage_vue_1.default },
    { path: '/', component: Login_vue_1.default },
    { path: '/home', component: Home_vue_1.default, children: [
            { path: '', component: Index_vue_1.default },
            { path: 'admin/info', component: AdminInfo_vue_1.default },
            { path: 'order/err', component: OrderError_vue_1.default },
            { path: 'funds/recharge', component: Recharge_vue_1.default },
            { path: 'funds/withdraw', component: Withdraw_vue_1.default },
            { path: 'products/types', component: ProudctsTypes_vue_1.default },
            { path: 'products/all', component: ProudctsAll_vue_1.default },
            { path: 'placards/platform', component: PlacardsPlatform_vue_1.default },
            { path: 'placards/site', component: PlacardsSite_vue_1.default },
            { path: 'sites', component: Sites_vue_1.default },
            { path: 'feedback/site', component: FeedbackSite_vue_1.default },
            { path: 'feedback/user', component: FeedbackUser_vue_1.default },
            { path: 'admins/role', component: AdminsRole_vue_1.default },
            { path: 'admins/list', component: AdminsList_vue_1.default },
        ] }
];
exports.default = routes;
//# sourceMappingURL=index.js.map
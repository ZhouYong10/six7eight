"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Login_vue_1 = require("./components/login/Login.vue");
const NoPage_vue_1 = require("@/components/NoPage.vue");
const Index_vue_1 = require("./components/Index.vue");
const Home_vue_1 = require("./components/Home.vue");
const AdminInfo_vue_1 = require("./components/AdminInfo.vue");
const OrderError_vue_1 = require("./components/OrderError.vue");
const Recharge_vue_1 = require("./components/Recharge.vue");
const Withdraw_vue_1 = require("./components/Withdraw.vue");
const ProudctsTypes_vue_1 = require("./components/ProudctsTypes.vue");
const ProudctsAll_vue_1 = require("./components/ProudctsAll.vue");
const PlacardsPlatform_vue_1 = require("./components/PlacardsPlatform.vue");
const PlacardsSite_vue_1 = require("./components/PlacardsSite.vue");
const Sites_vue_1 = require("./components/Sites.vue");
const FeedbackSite_vue_1 = require("./components/FeedbackSite.vue");
const FeedbackUser_vue_1 = require("./components/FeedbackUser.vue");
const AdminsRole_vue_1 = require("./components/AdminsRole.vue");
const AdminsList_vue_1 = require("./components/AdminsList.vue");
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
//# sourceMappingURL=routes.js.map
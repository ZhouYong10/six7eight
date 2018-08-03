"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const vue_router_1 = require("vue-router");
const element_ui_1 = require("element-ui");
const utils_1 = require("@/utils");
const router = new vue_router_1.default({
    routes: [
        { path: '*', component: () => Promise.resolve().then(() => require("@/components/NoPage.vue")) },
        { path: '/', component: () => Promise.resolve().then(() => require("./components/login/Login.vue")) },
        { path: '/home', component: () => Promise.resolve().then(() => require("./components/Home.vue")),
            children: [
                { path: '', component: () => Promise.resolve().then(() => require("./components/Index.vue")) },
                { path: 'admin/info', component: () => Promise.resolve().then(() => require("./components/AdminInfo.vue")) },
                { path: 'order/err', component: () => Promise.resolve().then(() => require("./components/OrderError.vue")) },
                { path: 'funds/recharge', component: () => Promise.resolve().then(() => require("./components/Recharge.vue")) },
                { path: 'funds/withdraw', component: () => Promise.resolve().then(() => require("./components/Withdraw.vue")) },
                { path: 'products/types', component: () => Promise.resolve().then(() => require("./components/ProudctTypes.vue")) },
                { path: 'products/all', component: () => Promise.resolve().then(() => require("./components/ProudctAll.vue")) },
                { path: 'placards/platform', component: () => Promise.resolve().then(() => require("./components/PlacardsPlatform.vue")) },
                { path: 'placards/site', component: () => Promise.resolve().then(() => require("./components/PlacardsSite.vue")) },
                { path: 'sites', component: () => Promise.resolve().then(() => require("./components/Sites.vue")) },
                { path: 'feedback/site', component: () => Promise.resolve().then(() => require("./components/FeedbackSite.vue")) },
                { path: 'feedback/user', component: () => Promise.resolve().then(() => require("./components/FeedbackUser.vue")) },
                { path: 'admins/role', component: () => Promise.resolve().then(() => require("./components/AdminsRole.vue")) },
                { path: 'admins/list', component: () => Promise.resolve().then(() => require("./components/AdminsList.vue")) },
            ] }
    ]
});
router.beforeEach((to, from, next) => __awaiter(this, void 0, void 0, function* () {
    const toPath = to.matched[0].path;
    if (toPath === '*' || toPath === '') {
        next();
    }
    else {
        const res = yield utils_1.axiosGet('/platform/logined');
        if (res.data.isLogin) {
            next();
        }
        else {
            element_ui_1.Message.error(res.data.msg);
            next('/');
        }
    }
}));
module.exports = router;
//# sourceMappingURL=router.js.map
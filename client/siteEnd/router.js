var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import VueRouter from "vue-router";
import { Message } from "element-ui";
import { document, axiosGet } from "@/utils";
import Vue from "vue";
import compObj from "./components";
import { getMenu, hasPermission, isLogin } from "./store";
Vue.use(VueRouter);
var router = new VueRouter({
    routes: [
        { path: '*', redirect: '/home' },
        { path: '/', component: compObj.login, meta: { title: '登录' } },
        { path: '/home', component: compObj.home,
            children: [
                { path: '', component: compObj.index, meta: { title: '首页' } },
                { path: 'admin/info', component: compObj.adminInfo, meta: { title: '账户信息' } },
                { path: 'product/:id', component: compObj.dealProduct, props: true },
                { path: 'order/error/manage', component: compObj.orderError },
                { path: 'recharge/records', component: compObj.rechargeRecord },
                { path: 'consume/records', component: compObj.consumeRecord },
                { path: 'profit/records', component: compObj.profitRecord },
                { path: 'withdraw/records', component: compObj.withdrawRecord },
                { path: 'product/type/manage', component: compObj.productType },
                { path: 'product/all/manage', component: compObj.product },
                { path: 'admin/role/manage', component: compObj.adminRole },
                { path: 'admin/list/manage', component: compObj.admins },
                { path: 'user/role/manage', component: compObj.usersRole },
                { path: 'user/list/manage', component: compObj.users },
                { path: 'feedback/mine/manage', component: compObj.feedback },
                { path: 'feedback/user/manage', component: compObj.userFeedback },
                { path: 'placard/manage', component: compObj.placard },
                { path: 'site/settings', component: compObj.settings },
            ]
        }
    ]
});
var whitePath = [
    '/home',
    '/home/admin/info',
];
router.beforeEach(function (to, from, next) { return __awaiter(_this, void 0, void 0, function () {
    var path, res, menu, productId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = to.path;
                if (!(path === '/')) return [3 /*break*/, 1];
                document.title = to.meta.title;
                next();
                return [3 /*break*/, 4];
            case 1:
                if (!isLogin()) return [3 /*break*/, 3];
                return [4 /*yield*/, axiosGet('/site/logined')];
            case 2:
                res = _a.sent();
                if (res.data.successed) {
                    if (whitePath.some(function (item) { return item === path; })) {
                        document.title = to.meta.title;
                        next();
                    }
                    else {
                        menu = void 0;
                        productId = to.params.id;
                        if (productId) {
                            menu = getMenu(productId, true);
                        }
                        else {
                            menu = getMenu(path, false);
                        }
                        if (menu && hasPermission(menu.fingerprint)) {
                            document.title = menu.name;
                            next();
                        }
                        else {
                            Message.error('您访问的地址不存在或没有访问权限！');
                            next('/home');
                        }
                    }
                }
                else {
                    Message.error(res.data.msg);
                    next('/');
                }
                return [3 /*break*/, 4];
            case 3:
                Message.error('请登录后操作！');
                next('/');
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
export default router;
//# sourceMappingURL=router.js.map
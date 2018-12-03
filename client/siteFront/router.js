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
import Vue from "vue";
import compObj from "./components";
import { document, axiosGet } from "@/utils";
import { Message } from "element-ui";
import { getMenu, hasPermission, isLogin, logout } from "./store";
Vue.use(VueRouter);
var router = new VueRouter({
    routes: [
        { path: '*', redirect: '/' },
        {
            path: '/', component: compObj.home,
            children: [
                { path: '', component: compObj.index, meta: { title: '公告' } },
                { path: 'self/info', component: compObj.myInfo, meta: { title: '账户信息' } },
                { path: 'product/:id', component: compObj.product, props: true, meta: { title: '订单信息' } },
                { path: 'recharge/records', component: compObj.rechargeRecord },
                { path: 'consume/records', component: compObj.consumeRecord },
                { path: 'profit/records', component: compObj.profitRecord },
                { path: 'withdraw/records', component: compObj.withdrawRecord },
                { path: 'lower/user', component: compObj.lowerUsers },
                { path: 'feedback/records', component: compObj.feedback },
            ]
        }
    ]
});
var whitePath = [
    '/',
    '/self/info',
];
router.beforeEach(function (to, from, next) { return __awaiter(_this, void 0, void 0, function () {
    var path, menu, productId, res, frontLogin, backLogin, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = to.path;
                if (!(path === '/')) return [3 /*break*/, 1];
                document.title = to.meta.title;
                next();
                return [3 /*break*/, 9];
            case 1:
                if (!whitePath.some(function (item) { return item === path; })) return [3 /*break*/, 2];
                document.title = to.meta.title;
                next();
                return [3 /*break*/, 9];
            case 2:
                menu = void 0;
                productId = to.params.id;
                if (productId) {
                    menu = getMenu(productId, true);
                }
                else {
                    menu = getMenu(path, false);
                }
                if (!menu) return [3 /*break*/, 8];
                document.title = menu.name;
                return [4 /*yield*/, axiosGet('/user/logined')];
            case 3:
                res = _a.sent();
                console.log(res, '  ============================');
                frontLogin = isLogin();
                backLogin = res.data.successed;
                if (frontLogin && backLogin) {
                    console.log(' 都登录');
                    if (hasPermission(menu.fingerprint)) {
                        next();
                    }
                    else {
                        Message.error('您访问的地址不存在或没有访问权限！');
                        next('/');
                    }
                }
                if (!(frontLogin && !backLogin)) return [3 /*break*/, 5];
                console.log(' 只有前端登录');
                return [4 /*yield*/, axiosGet('/user/auth/logout')];
            case 4:
                data = _a.sent();
                logout(data);
                next();
                _a.label = 5;
            case 5:
                if (!(!frontLogin && backLogin)) return [3 /*break*/, 7];
                console.log(' 只有后端登录');
                return [4 /*yield*/, axiosGet('/user/auth/logout')];
            case 6:
                _a.sent();
                next();
                _a.label = 7;
            case 7:
                if (!frontLogin && !backLogin) {
                    console.log(' 前后端都没有登录');
                    next();
                }
                return [3 /*break*/, 9];
            case 8:
                Message.error('您访问的地址不存在或没有访问权限！');
                next('/');
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
export default router;
//# sourceMappingURL=router.js.map
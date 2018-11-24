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
import Storage, { axiosGet, parseRightsToRoutes, StorageKey } from "@/utils";
Vue.use(VueRouter);
var router = new VueRouter({
    routes: [
        { path: '*', component: compObj.noPage },
        {
            path: '/', component: compObj.home,
            children: [
                { path: '', component: compObj.index },
                { path: 'selfInfo', component: compObj.myInfo },
                { path: 'product/:id', component: compObj.product, props: true }
            ].concat(getRoutes())
        }
    ]
});
function getRoutes() {
    var state = Storage.getItem(StorageKey.user);
    if (state && state.rights) {
        return parseRightsToRoutes(state.rights, compObj);
    }
    else {
        return [];
    }
}
router.beforeEach(function (to, from, next) { return __awaiter(_this, void 0, void 0, function () {
    var pathArr, pathId, vue, productMenu, roleMenu, userRights_1, hasRight;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pathArr = to.path.split('/');
                pathId = pathArr[pathArr.length - 1];
                vue = router.app;
                productMenu = vue.$store.state.typeRights;
                roleMenu = vue.$store.state.rights;
                if (!(productMenu && roleMenu)) return [3 /*break*/, 1];
                userRights_1 = [];
                productMenu.forEach(function (type) {
                    if (type.onSale && type.children.length > 0) {
                        type.children.forEach(function (product) {
                            if (product.onSale) {
                                userRights_1.push(product.id);
                            }
                        });
                    }
                });
                roleMenu.forEach(function (menu) {
                    if (menu.children && menu.children.length > 0) {
                        menu.children.forEach(function (item) {
                            userRights_1.push(item.id);
                        });
                    }
                    else {
                        userRights_1.push(menu.id);
                    }
                });
                if (pathId.split('-').length > 2 && userRights_1.indexOf(pathId) === -1) {
                    router.replace('/none/page/fund');
                }
                else {
                    next();
                }
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, axiosGet('/user/has/right/' + (pathId || 'index'))];
            case 2:
                hasRight = _a.sent();
                if (hasRight) {
                    next();
                }
                else {
                    router.replace('/none/page/fund');
                    next();
                }
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
export default router;
//# sourceMappingURL=router.js.map
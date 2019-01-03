var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
import axios from "axios";
import * as pako from "pako";
import { devConf } from "../../config";
import { Message } from "element-ui";
import window from "@/window";
import * as moment from "moment";
export function shadowCloseSideMenu() {
    var sideMenu = document.querySelector('.el-aside');
    sideMenu.addEventListener('click', function (e) {
        if (e.target == sideMenu) {
            sideMenu.classList.remove('show-side-menu');
        }
    });
}
export function closeSideMenu() {
    document.querySelector('.el-aside').classList.remove('show-side-menu');
}
export function showSideMenu() {
    var sideMenu = document.querySelector('.el-aside');
    sideMenu.classList.add('show-side-menu');
}
export var StorageKey;
(function (StorageKey) {
    StorageKey["platform"] = "platform-info";
    StorageKey["site"] = "site-info";
    StorageKey["user"] = "user-info";
})(StorageKey || (StorageKey = {}));
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    Message.warning('访问超时！');
    return Promise.reject(error);
});
axios.interceptors.response.use(function (res) {
    var url = res.config.url;
    if (url && url.search(/\/logined$/) != -1) {
        return res;
    }
    else {
        if (res.data.successed) {
            return res.data.data;
        }
        else {
            Message({
                message: res.data.msg,
                type: 'error',
                duration: 5000,
                showClose: true
            });
            return;
        }
    }
}, function (error) {
    Message.error('未知错误，请联系系统管理员！');
    return Promise.reject(error);
});
export function zip(info) {
    return pako.deflate(JSON.stringify(info), { to: "string" });
}
export function unzip(info) {
    return JSON.parse(pako.inflate(info, { to: "string" }));
}
export function pageChangeMsg(msg) {
    Message({
        message: msg,
        type: 'error',
        duration: 10000,
        showClose: true
    });
}
export function host(path) {
    if (path === void 0) { path = ''; }
    var host = devConf.serveHost + ':' + devConf.servePort;
    return host + path;
}
function isProduction(path, config) {
    var servePath = path;
    var axiosConf = config;
    if (process.env.NODE_ENV !== 'production') {
        servePath = host(path);
        axiosConf = __assign({ withCredentials: true }, config);
    }
    return { servePath: servePath, axiosConf: axiosConf };
}
export function axiosGet(path, config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, servePath, axiosConf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = isProduction(path, config), servePath = _a.servePath, axiosConf = _a.axiosConf;
                    return [4 /*yield*/, axios.get(servePath, axiosConf)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
export function axiosPost(path, params, config) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, servePath, axiosConf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = isProduction(path, config), servePath = _a.servePath, axiosConf = _a.axiosConf;
                    return [4 /*yield*/, axios.post(servePath, params, axiosConf)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
export function addTypeToMenu(menus, type) {
    menus.unshift(type);
}
export function typeOrProductUpdate(menus, item) {
    for (var i = 0; i < menus.length; i++) {
        var typeMenu = menus[i];
        if (typeMenu.id === item.id) {
            typeMenu.name = item.name;
            typeMenu.onSale = item.onSale;
            return;
        }
        else if (typeMenu.children && typeMenu.children.length > 0) {
            typeOrProductUpdate(typeMenu.children, item);
        }
    }
}
export function addProductToMenu(menus, typeId, product) {
    for (var i = 0; i < menus.length; i++) {
        var item = menus[i];
        if (item.id === typeId) {
            item.children.unshift(product);
            return;
        }
    }
}
export function findMenu(menus, path, isId) {
    for (var i = 0; i < menus.length; i++) {
        var item = menus[i];
        if ((!isId && item.path === path) || (isId && item.id === path)) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            var menu = findMenu(item.children, path, isId);
            if (menu) {
                return menu;
            }
        }
    }
}
export function getProductUserPrice(product, userRoleType) {
    if (userRoleType === void 0) { userRoleType = 'role_gold'; }
    var price;
    switch (userRoleType) {
        case 'role_top':
            price = product.topPrice;
            break;
        case 'role_super':
            price = product.superPrice;
            break;
        default:
            price = product.goldPrice;
    }
    return price;
}
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export function changeMenuWaitCount(menus, aim, cb) {
    for (var i = 0; i < menus.length; i++) {
        var menu = menus[i];
        if (menu.fingerprint === aim) {
            return cb(menu, null);
        }
        if (menu.type !== 'menu') {
            var menuItems = menu.children;
            for (var i_1 = 0; i_1 < menuItems.length; i_1++) {
                var menuItem = menuItems[i_1];
                if (menuItem.fingerprint === aim) {
                    return cb(menuItem, menu);
                }
            }
        }
    }
}
export function today() {
    return moment().format('YYYY-MM-DD');
}
export function myDateFromat(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
export function countOrderProgress(order) {
    if (order.status === '执行中') {
        var seconds = Math.round((Date.now() - Date.parse(order.dealTime)) / (1000 * 60) - order.queueTime * 60);
        if (seconds < 0) {
            order.status = '排队中';
        }
        else {
            var executeNum = seconds * order.speed;
            if (executeNum >= order.num) {
                order.executeNum = order.num;
                order.status = '待结算';
            }
            else {
                order.executeNum = executeNum;
            }
        }
    }
    return parseFloat((order.executeNum / order.num * 100).toFixed(2));
}
export var document = window.document;
var Storage = {
    length: function () {
        return window.sessionStorage.length;
    },
    key: function (index) {
        return window.sessionStorage.key(index);
    },
    getItem: function (key) {
        var info = window.sessionStorage.getItem(key);
        return info ? unzip(info) : info;
    },
    setItem: function (key, value) {
        window.sessionStorage.setItem(key, zip(value));
    },
    removeItem: function (key) {
        window.sessionStorage.removeItem(key);
    },
    clear: function () {
        window.sessionStorage.clear();
    }
};
export default Storage;
//# sourceMappingURL=utils.js.map
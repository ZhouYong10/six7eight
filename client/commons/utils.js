"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const config_1 = require("../../config");
const element_ui_1 = require("element-ui");
const window_1 = require("@/window");
var StorageKey;
(function (StorageKey) {
    StorageKey["platform"] = "platform-info";
    StorageKey["site"] = "site-info";
    StorageKey["user"] = "user-info";
})(StorageKey = exports.StorageKey || (exports.StorageKey = {}));
axios_1.default.interceptors.request.use(config => {
    return config;
}, error => {
    element_ui_1.Message.warning('访问超时！');
    return Promise.reject(error);
});
axios_1.default.interceptors.response.use(res => {
    let url = res.config.url;
    if (url && url.search(/\/logined$/) != -1) {
        return res;
    }
    else {
        if (res.data.successed) {
            return res.data.data;
        }
        else {
            element_ui_1.Message({
                message: res.data.msg,
                type: 'error',
                duration: 10000,
                showClose: true
            });
            return Promise.reject(new Error(res.data.msg));
        }
    }
}, error => {
    element_ui_1.Message.error('未知错误，请联系系统管理员！');
    return Promise.reject(error);
});
function host(path = '') {
    const host = config_1.devConf.serveHost + ':' + config_1.devConf.servePort;
    return host + path;
}
exports.host = host;
function isProduction(path, config) {
    let servePath = path;
    let axiosConf = config;
    if (process.env.NODE_ENV !== 'production') {
        servePath = host(path);
        axiosConf = Object.assign({ withCredentials: true }, config);
    }
    return { servePath, axiosConf };
}
function axiosGet(path, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let { servePath, axiosConf } = isProduction(path, config);
        return yield axios_1.default.get(servePath, axiosConf);
    });
}
exports.axiosGet = axiosGet;
function axiosPost(path, params, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let { servePath, axiosConf } = isProduction(path, config);
        return yield axios_1.default.post(servePath, params, axiosConf);
    });
}
exports.axiosPost = axiosPost;
function addTypeToMenu(menus, type) {
    menus.unshift(type);
}
exports.addTypeToMenu = addTypeToMenu;
function typeOrProductUpdate(menus, item) {
    for (let i = 0; i < menus.length; i++) {
        let typeMenu = menus[i];
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
exports.typeOrProductUpdate = typeOrProductUpdate;
function addProductToMenu(menus, typeId, product) {
    for (let i = 0; i < menus.length; i++) {
        let item = menus[i];
        if (item.id === typeId) {
            item.children.unshift(product);
            break;
        }
    }
}
exports.addProductToMenu = addProductToMenu;
function getProductUserPrice(product, userRoleType = 'role_gold') {
    let price;
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
exports.getProductUserPrice = getProductUserPrice;
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.deepClone = deepClone;
function parseRightsToRoutes(rights, compObj, prePath = '/') {
    function parseRights(rights, compObj, routes) {
        for (let i = 0; i < rights.length; i++) {
            let item = rights[i];
            if (item.componentName) {
                routes.push({
                    path: prePath + item.id,
                    component: compObj[item.componentName]
                });
            }
            if (item.type === 'menuGroup') {
                parseRights(item.children, compObj, routes);
            }
        }
    }
    let routes = [];
    parseRights(rights, compObj, routes);
    return routes;
}
exports.parseRightsToRoutes = parseRightsToRoutes;
function rightFilter(rights, checkedRights) {
    for (let i = 0; i < checkedRights.length; i++) {
        let aim = checkedRights[i];
        for (let j = 0; j < rights.length; j++) {
            tagRight(rights[j], aim);
        }
    }
    return delRight(rights);
}
exports.rightFilter = rightFilter;
function delRight(rights) {
    return rights.filter((val) => {
        if (val.saved) {
            if (val.children && val.children.length > 0) {
                val.children = delRight(val.children);
            }
            return true;
        }
    });
}
function tagRight(right, aim) {
    if (right.id === aim.id) {
        right.saved = true;
        return true;
    }
    else if (right.children && right.children.length > 0) {
        let children = right.children;
        for (let i = 0; i < children.length; i++) {
            if (tagRight(children[i], aim)) {
                right.saved = true;
                return true;
            }
        }
    }
}
const Storage = {
    length() {
        return window_1.default.sessionStorage.length;
    },
    key(index) {
        return window_1.default.sessionStorage.key(index);
    },
    getItem(key) {
        return JSON.parse(window_1.default.sessionStorage.getItem(key));
    },
    setItem(key, value) {
        window_1.default.sessionStorage.setItem(key, JSON.stringify(value));
    },
    removeItem(key) {
        window_1.default.sessionStorage.removeItem(key);
    },
    clear() {
        window_1.default.sessionStorage.clear();
    }
};
exports.default = Storage;
//# sourceMappingURL=utils.js.map
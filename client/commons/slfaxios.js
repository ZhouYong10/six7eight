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
import { Loading, Message } from "element-ui";
import storePlat from '../platform/store';
import storeSite from '../siteEnd/store';
import { host } from "./utils";
import { window } from '@/window';
var loadingInstance;
axios.interceptors.request.use(function (config) {
    loadingInstance = Loading.service({
        target: 'main',
        text: '玩命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
    });
    return config;
}, function (error) {
    Message.warning('访问超时！');
    return Promise.reject(error);
});
axios.interceptors.response.use(function (res) {
    loadingInstance.close();
    var url = res.config.url;
    if (url && url.search(/\/logined$/) != -1) {
        return res;
    }
    else {
        if (res.data.successed) {
            return res.data.data;
        }
        else {
            var info = res.data.msg.split('!-');
            Message({
                message: info[0],
                type: 'error',
                duration: 5000,
                showClose: true
            });
            if (info[1]) {
                if (info[1] === 'platform') {
                    storePlat.commit('logout');
                    if (process.env.NODE_ENV === 'production') {
                        window.history.go('/platform');
                    }
                    else {
                        window.history.go('/platform.html');
                    }
                }
                if (info[1] === 'site') {
                    storeSite.commit('logout');
                    if (process.env.NODE_ENV === 'production') {
                        window.history.go('/admin');
                    }
                    else {
                        window.history.go('/siteEnd.html');
                    }
                }
            }
            return;
        }
    }
}, function (error) {
    Message.error('未知错误，请联系系统管理员！');
    return Promise.reject(error);
});
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
//# sourceMappingURL=slfaxios.js.map
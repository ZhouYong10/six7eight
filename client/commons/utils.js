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
var StorageKey;
(function (StorageKey) {
    StorageKey["platform"] = "platform-info";
    StorageKey["site"] = "site-info";
    StorageKey["user"] = "user-info";
})(StorageKey = exports.StorageKey || (exports.StorageKey = {}));
axios_1.default.interceptors.request.use(config => {
    return config;
}, error => {
    element_ui_1.Message.error('加载超时！');
    return Promise.reject(error);
});
axios_1.default.interceptors.response.use(data => {
    return data;
}, error => {
    element_ui_1.Message.error('加载失败！');
    return Promise.reject(error);
});
function host(path) {
    const host = 'http://' + config_1.devConf.serveIp + ':' + config_1.devConf.servePort;
    return host + path;
}
function axiosGet(path, config) {
    return __awaiter(this, void 0, void 0, function* () {
        return process.env.NODE_ENV === 'production' ?
            yield axios_1.default.get(path, config) :
            yield axios_1.default.get(host(path), Object.assign({ withCredentials: true }, config));
    });
}
exports.axiosGet = axiosGet;
function axiosPost(path, params, config) {
    return __awaiter(this, void 0, void 0, function* () {
        return process.env.NODE_ENV === 'production' ?
            yield axios_1.default.post(path, params, config) :
            yield axios_1.default.post(host(path), params, Object.assign({ withCredentials: true }, config));
    });
}
exports.axiosPost = axiosPost;
//# sourceMappingURL=utils.js.map
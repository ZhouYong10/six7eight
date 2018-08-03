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
const vue_1 = require("vue");
const vuex_1 = require("vuex");
const vue_router_1 = require("vue-router");
const element_ui_1 = require("element-ui");
require("element-ui/lib/theme-chalk/index.css");
require("./assets/commons/main.css");
const platform_1 = require("./route/platform");
const utils_1 = require("./utils");
const window = require("./window");
vue_1.default.use(vuex_1.default);
vue_1.default.use(vue_router_1.default);
vue_1.default.use(element_ui_1.default);
const store = new vuex_1.default.Store({
    state: {
        info: (() => {
            let info = JSON.parse(window.sessionStorage.getItem(utils_1.StorageKey.platform));
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo(state, data) {
            state.info = {
                user: data
            };
            window.sessionStorage.setItem(utils_1.StorageKey.platform, JSON.stringify(state.info));
        },
        changeUser(state, user) {
            state.info.user = user;
        }
    }
});
const router = new vue_router_1.default({
    routes: platform_1.default
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
let app = new vue_1.default({
    el: "#app",
    store,
    router,
    computed: {
        getStateInfo() {
            return this.$store.state.info;
        }
    },
    watch: {
        getStateInfo: {
            handler: function (val) {
                window.sessionStorage.setItem(utils_1.StorageKey.platform, JSON.stringify(val));
            },
            deep: true
        }
    }
});
//# sourceMappingURL=platform.js.map
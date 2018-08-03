"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vuex_1 = require("vuex");
const vue_router_1 = require("vue-router");
const axios_1 = require("axios");
const VueAxios = require("vue-axios");
const element_ui_1 = require("element-ui");
require("element-ui/lib/theme-chalk/index.css");
require("@/css/main.css");
const SideMenu_vue_1 = require("./siteFront/components/SideMenu.vue");
const HeaderMenu_vue_1 = require("./siteFront/components/HeaderMenu.vue");
const routes_1 = require("./siteFront/routes");
vue_1.default.use(vuex_1.default);
vue_1.default.use(vue_router_1.default);
vue_1.default.use(VueAxios, axios_1.default);
vue_1.default.use(element_ui_1.default);
const store = new vuex_1.default.Store({
    state: {},
    mutations: {}
});
const router = new vue_router_1.default({
    routes: routes_1.default
});
let app = new vue_1.default({
    store,
    router,
    el: "#app",
    computed: Object.assign({}, vuex_1.mapState([])),
    components: {
        SideMenu: SideMenu_vue_1.default,
        HeaderMenu: HeaderMenu_vue_1.default
    }
});
//# sourceMappingURL=siteFront.js.map
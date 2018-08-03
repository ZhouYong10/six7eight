"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vuex_1 = require("vuex");
const vue_router_1 = require("vue-router");
const axios_1 = require("axios");
const VueAxios = require("vue-axios");
const element_ui_1 = require("element-ui");
require("element-ui/lib/theme-chalk/index.css");
require("./assets/commons/main.css");
const SideMenu_vue_1 = require("./components/site-front/SideMenu.vue");
const HeaderMenu_vue_1 = require("./components/site-front/HeaderMenu.vue");
const site_front_1 = require("./route/site-front");
vue_1.default.use(vuex_1.default);
vue_1.default.use(vue_router_1.default);
vue_1.default.use(VueAxios, axios_1.default);
vue_1.default.use(element_ui_1.default);
const store = new vuex_1.default.Store({
    state: {},
    mutations: {}
});
const router = new vue_router_1.default({
    routes: site_front_1.default
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
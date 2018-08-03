"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const vuex_1 = require("vuex");
const vue_router_1 = require("vue-router");
const element_ui_1 = require("element-ui");
require("element-ui/lib/theme-chalk/index.css");
require("@/css/main.css");
const utils_1 = require("@/utils");
const window = require("@/window");
vue_1.default.use(vuex_1.default);
vue_1.default.use(vue_router_1.default);
vue_1.default.use(element_ui_1.default);
let app = new vue_1.default({
    el: "#app",
    store: require('./platform/store'),
    router: require('./platform/router'),
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
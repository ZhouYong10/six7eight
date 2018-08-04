var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import Vue from "vue";
import Vuex, { mapState } from "vuex";
import VueRouter from "vue-router";
import axios from "axios";
import * as VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import SideMenu from "./siteFront/components/SideMenu.vue";
import HeaderMenu from "./siteFront/components/HeaderMenu.vue";
import routes from "./siteFront/routes";
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(ElementUI);
var store = new Vuex.Store({
    state: {},
    mutations: {}
});
var router = new VueRouter({
    routes: routes
});
var app = new Vue({
    store: store,
    router: router,
    el: "#app",
    computed: __assign({}, mapState([])),
    components: {
        SideMenu: SideMenu,
        HeaderMenu: HeaderMenu
    }
});
//# sourceMappingURL=siteFront.js.map
import Vue from "vue";
import Vuex, {mapState} from "vuex";
import VueRouter from "vue-router";
import ElementUI, {Message} from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "./assets/commons/main.css";
import routes from "./route/platform";
import {axiosGet, StorageKey} from "./utils";
import window = require("./window");


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);

const store = new Vuex.Store({
    state: {
        info: (() => {
            let info = JSON.parse(window.sessionStorage.getItem(StorageKey.platform));
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo(state, data) {
            state.info = {
                user: data
            };
            window.sessionStorage.setItem(StorageKey.platform, JSON.stringify(state.info));
        }
    }
});

const router = new VueRouter({
    routes
});

router.beforeEach(async (to, from, next) => {
    const toPath = to.matched[0].path;
    if (toPath === '*' || toPath === '') {
        next();
    } else {
        const res = await axiosGet('/platform/logined');
        if (res.data.isLogin) {
            next();
        }else {
            Message.error(res.data.msg);
            next('/');
        }
    }
});

let app = new Vue({
    store,
    router,
    el: "#app"
});
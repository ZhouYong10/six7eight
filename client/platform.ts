import Vue from "vue";
import Vuex, {mapState} from "vuex";
import VueRouter from "vue-router";
import axios from "axios";
import VueAxios = require("vue-axios");
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "./assets/commons/main.css";
import routes from "./route/platform";

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(ElementUI);

const store = new Vuex.Store({
    state: {

    },
    mutations: {

    }
});

const router = new VueRouter({
    routes
});

let app = new Vue({
    store,
    router,
    el: "#app"
});
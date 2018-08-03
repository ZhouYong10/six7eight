import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import {axiosGet, StorageKey} from "@/utils";
import window = require("@/window");

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);


let app = new Vue({
    el: "#app",
    store: require('./platform/store'),
    router: require('./platform/router'),
    computed: {
        getStateInfo():any {
            return this.$store.state.info;
        }
    },
    watch: {
        getStateInfo: {
            handler: function (val) {
                window.sessionStorage.setItem(StorageKey.platform, JSON.stringify(val));
            },
            deep: true
        }
    }
});
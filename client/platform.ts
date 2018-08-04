import Vue from "vue";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./platform/store";
import router from "./platform/router";
import {axiosGet, StorageKey} from "@/utils";
import window from "@/window";


Vue.use(ElementUI);

let app = new Vue({
    el: "#app",
    store,
    router,
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
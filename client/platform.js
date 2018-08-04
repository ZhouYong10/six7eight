import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./platform/store";
import router from "./platform/router";
import { StorageKey } from "@/utils";
import window from "@/window";
Vue.use(ElementUI);
var app = new Vue({
    el: "#app",
    store: store,
    router: router,
    computed: {
        getStateInfo: function () {
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
//# sourceMappingURL=platform.js.map
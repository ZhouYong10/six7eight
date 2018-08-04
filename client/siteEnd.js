import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteEnd/store";
import router from "./siteEnd/router";
import Storage, { StorageKey } from "@/utils";
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
                Storage.setItem(StorageKey.platform, val);
            },
            deep: true
        }
    }
});
//# sourceMappingURL=siteEnd.js.map
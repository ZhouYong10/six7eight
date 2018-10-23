import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteEnd/store";
import router from "./siteEnd/router";
import Storage, { StorageKey } from "@/utils";
import reminder from "./commons/components/Reminder.vue";
Vue.use(ElementUI);
Vue.component('sf-reminder', reminder);
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
                Storage.setItem(StorageKey.site, val);
            },
            deep: true
        }
    }
});
//# sourceMappingURL=siteEnd.js.map
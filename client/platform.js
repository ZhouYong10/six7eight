import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./platform/store";
import router from "./platform/router";
import reminder from "./commons/components/Reminder.vue";
import Storage, { StorageKey } from "@/utils";
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
                Storage.setItem(StorageKey.platform, val);
            },
            deep: true
        }
    }
});
//# sourceMappingURL=platform.js.map
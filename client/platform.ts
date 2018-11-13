import Vue from "vue";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./platform/store";
import router from "./platform/router";
import reminder from "./commons/components/Reminder.vue";
import Storage, {StorageKey} from "@/utils";

Vue.use(ElementUI);
Vue.component('sf-reminder', reminder);

let app = new Vue({
    el: "#app",
    store,
    router,
    computed: {
        getState():any {
            return this.$store.state;
        }
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.platform, val);
            },
            deep: true
        }
    }
});
import Vue from "vue";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import Storage, {StorageKey} from "@/utils";
import reminder from "./commons/components/Reminder.vue";


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
                Storage.setItem(StorageKey.user, val);
            },
            deep: true
        }
    }
});
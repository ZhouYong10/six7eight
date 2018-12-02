import Vue from "vue";
import VueSocketio from 'vue-socket.io';
import * as socketio from 'socket.io-client';
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteEnd/store";
import router from "./siteEnd/router";
import Storage, {StorageKey, host} from "@/utils";
import reminder from "./commons/components/Reminder.vue";


Vue.use(ElementUI);
Vue.use(VueSocketio, socketio(host()), store);
Vue.component('sf-reminder', reminder);


let app = new Vue({
    el: "#app",
    store,
    router,
    computed: {
        getState():any {
            return this.$store.state;
        },
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.site, val);
            },
            deep: true
        }
    }
});
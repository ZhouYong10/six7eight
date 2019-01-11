import Vue from "vue";
import VueSocketio from 'vue-socket.io';
import * as socketio from 'socket.io-client';
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./platform/store";
import router from "./platform/router";
import App from './App.vue';
import reminder from "./commons/components/Reminder.vue";
import { host } from "@/utils";
import { StorageKey, Storage } from "@/slfstorage";
Vue.use(ElementUI);
Vue.use(VueSocketio, socketio(host()), store);
Vue.component('sf-reminder', reminder);
new Vue({
    store: store,
    router: router,
    computed: {
        getState: function () {
            return this.$store.state;
        },
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.platform, val);
            },
            deep: true
        },
    },
    render: function (h) { return h(App); }
}).$mount('#app');
//# sourceMappingURL=platform.js.map
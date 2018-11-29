import Vue from "vue";
import VueSocketio from 'vue-socket.io';
import * as socketio from 'socket.io-client';
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./platform/store";
import router from "./platform/router";
import reminder from "./commons/components/Reminder.vue";
import Storage, { StorageKey, host } from "@/utils";
Vue.use(ElementUI);
Vue.use(VueSocketio, socketio(host()), store);
Vue.component('sf-reminder', reminder);
var app = new Vue({
    el: "#app",
    store: store,
    router: router,
    computed: {
        getState: function () {
            return this.$store.state;
        },
        roleRights: function () {
            var user = store.state.user;
            return user ? user.role.rights : [];
        },
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.platform, val);
            },
            deep: true
        },
        $route: function (to, from) {
            var pathArr = to.path.split('/');
            var pathId = pathArr[pathArr.length - 1];
            if (pathId.split('-').length > 2 && this.roleRights.indexOf(pathId) === -1) {
                this.$router.replace('/');
            }
        }
    }
});
//# sourceMappingURL=platform.js.map
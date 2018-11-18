import Vue from "vue";
import VueSocketio from 'vue-socket.io';
import * as socketio from 'socket.io-client';
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import Storage, { StorageKey, axiosGet, parseRightsToRoutes, host } from "@/utils";
import reminder from "./commons/components/Reminder.vue";
import compObj from "./siteFront/components";
Vue.use(ElementUI);
Vue.use(VueSocketio, socketio(host()), store);
Vue.component('sf-reminder', reminder);
var app = new Vue({
    el: "#app",
    store: store,
    router: router,
    beforeCreate: function () {
        var _this = this;
        var state = Storage.getItem(StorageKey.user);
        if (!state || !state.rights) {
            axiosGet('/user/init/data').then(function (data) {
                _this.$store.commit('saveInitData', data);
                _this.$router.addRoutes([
                    {
                        path: '/', component: compObj.home,
                        children: parseRightsToRoutes(data.rights, compObj)
                    }
                ]);
            });
        }
    },
    computed: {
        getState: function () {
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
//# sourceMappingURL=siteFront.js.map
import Vue from "vue";
import VueSocketio from 'vue-socket.io';
import * as socketio from 'socket.io-client';
import ElementUI, { Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import App from './App.vue';
import { host } from "@/utils";
import { AxiosGet } from "@/slfaxios";
import { StorageKey, Storage } from "@/slfstorage";
import reminder from "./commons/components/Reminder.vue";
Vue.use(ElementUI);
Vue.use(VueSocketio, socketio(host()), store);
Vue.component('sf-reminder', reminder);
new Vue({
    store: store,
    router: router,
    beforeCreate: function () {
        var _this = this;
        var state = Storage.getItem(StorageKey.user);
        if (!state || !state.rightMenus) {
            AxiosGet('/user/init/data').then(function (res) {
                var data = res.data;
                if (data.successed) {
                    _this.$store.commit('saveInitData', data.data);
                }
                else {
                    Message({
                        message: data.msg,
                        type: 'error',
                        duration: 5000,
                        showClose: true
                    });
                }
            });
        }
    },
    computed: {
        getState: function () {
            return this.$store.state;
        },
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.user, val);
            },
            deep: true
        },
    },
    render: function (h) { return h(App); }
}).$mount('#app');
//# sourceMappingURL=siteFront.js.map
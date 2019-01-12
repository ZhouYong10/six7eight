import Vue from "vue";
import VueSocketio from 'vue-socket.io';
import * as socketio from 'socket.io-client';
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import App from './App.vue';
import {host} from "@/utils";
import {axiosGet} from "@/slfaxios";
import {StorageKey, Storage} from "@/slfstorage";
import reminder from "./commons/components/Reminder.vue";

Vue.use(ElementUI);
Vue.use(VueSocketio, socketio(host()), store);
Vue.component('sf-reminder', reminder);


new Vue({
    store,
    router,
    async beforeCreate() {
        let state = Storage.getItem(StorageKey.user);
        if (!state || !state.rightMenus) {
            let data = await axiosGet('/user/init/data');
            this.$store.commit('saveInitData', data);
        }
    },
    computed: {
        getState():any {
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
    render: h => h(App)
}).$mount('#app');
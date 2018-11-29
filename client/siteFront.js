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
        },
        userRights: function () {
            var productMenu = store.state.typeRights || [];
            var roleMenu = store.state.rights || [];
            var userRights = [];
            productMenu.forEach(function (type) {
                if (type.onSale && type.children.length > 0) {
                    type.children.forEach(function (product) {
                        if (product.onSale) {
                            userRights.push(product.id);
                        }
                    });
                }
            });
            roleMenu.forEach(function (menu) {
                if (menu.children && menu.children.length > 0) {
                    menu.children.forEach(function (item) {
                        userRights.push(item.id);
                    });
                }
                else {
                    userRights.push(menu.id);
                }
            });
            return userRights;
        }
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.user, val);
            },
            deep: true
        },
        $route: function (to, from) {
            var pathArr = to.path.split('/');
            var pathId = pathArr[pathArr.length - 1];
            if (pathId.split('-').length > 2 && this.userRights.indexOf(pathId) === -1) {
                this.$router.replace('/home');
            }
        }
    }
});
//# sourceMappingURL=siteFront.js.map
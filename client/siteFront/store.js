import Vuex from "vuex";
import Vue from "vue";
import Storage, { StorageKey } from "@/utils";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: (function () {
        var state = Storage.getItem(StorageKey.user);
        return state ? state : {};
    })(),
    mutations: {
        saveInitData: function (state, data) {
            Vue.set(state, 'siteName', data.siteName);
            Vue.set(state, 'typeRights', data.typeRights);
            Vue.set(state, 'rights', data.rights);
        },
        saveUser: function (state, user) {
            Vue.set(state, 'user', user);
        },
        clearUser: function (state) {
            state.user = null;
        },
        updateUsername: function (state, username) {
            state.user.username = username;
        },
        SOCKET_SITE_USER_ADD_TYPE_TO_MENU: function (state, type) {
            console.log(type, ' ================================');
        }
    }
});
export default store;
//# sourceMappingURL=store.js.map
import Vue from "vue";
import Vuex from "vuex";
import Storage, { StorageKey } from "@/utils";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: (function () {
        var info = Storage.getItem(StorageKey.platform);
        return info ? info : {};
    })(),
    mutations: {
        saveInfo: function (state, user) {
            Vue.set(state, 'user', user);
        },
        clearUser: function (state) {
            state.user = null;
        }
    }
});
export default store;
//# sourceMappingURL=store.js.map
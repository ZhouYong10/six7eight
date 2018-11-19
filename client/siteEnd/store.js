import Vuex from "vuex";
import Vue from "vue";
import Storage, { StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate } from "@/utils";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: (function () {
        var info = Storage.getItem(StorageKey.site);
        return info ? info : {};
    })(),
    mutations: {
        saveInfo: function (state, data) {
            Vue.set(state, 'user', data.user);
            Vue.set(state, 'rights', data.rights);
        },
        clearUser: function (state) {
            state.user = null;
        },
        addTypeToMenu: function (state, type) {
            state.user.role.rights.unshift(type.id);
            addTypeToMenu(state.rights, type);
        },
        addProductToMenu: function (state, data) {
            addProductToMenu(state.rights, data.typeId, data.product);
        },
        typeOrProductUpdate: function (state, data) {
            typeOrProductUpdate(state.rights, data);
        },
    }
});
export default store;
//# sourceMappingURL=store.js.map
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
            addTypeToMenu(state.user.role.rights[0][0].children, type);
        },
        addProductToMenu: function (state, data) {
            addProductToMenu(state.user.role.rights[0][0].children, data.typeId, data.product);
        },
        typeOrProductUpdate: function (state, data) {
            typeOrProductUpdate(state.user.role.rights[0][0].children, data);
        },
    }
});
export default store;
//# sourceMappingURL=store.js.map
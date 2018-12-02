import Vue from "vue";
import Vuex from "vuex";
import Storage, { StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate } from "@/utils";
import { findMenu } from "../commons/utils";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: (function () {
        var info = Storage.getItem(StorageKey.platform);
        return info ? info : {};
    })(),
    mutations: {
        login: function (state, data) {
            Vue.set(state, 'userId', data.userId);
            Vue.set(state, 'username', data.username);
            Vue.set(state, 'userState', data.userState);
            Vue.set(state, 'roleId', data.roleId);
            Vue.set(state, 'roleType', data.roleType);
            Vue.set(state, 'roleName', data.roleName);
            Vue.set(state, 'menus', data.menus);
            Vue.set(state, 'permissions', data.permissions);
        },
        logout: function (state) {
            Storage.removeItem(StorageKey.platform);
        },
        addTypeToMenu: function (state, type) {
            state.permissions.unshift(type.id);
            addTypeToMenu(state.menus, type);
        },
        addProductToMenu: function (state, data) {
            var product = data.product;
            addProductToMenu(state.menus, data.typeId, product);
            state.permissions.unshift(product.id);
        },
        typeOrProductUpdate: function (state, data) {
            typeOrProductUpdate(state.menus, data);
        },
        changeRights: function (state, data) {
            state.menus = data.menuRights;
            state.roleName = data.roleName;
            state.permissions = data.rights;
        },
        changeUserState: function (state, userState) {
            state.userState = userState;
        },
        changeUserRole: function (state, data) {
            state.menus = data.menuRights;
            state.roleId = data.role.id;
            state.roleType = data.role.type;
            state.roleName = data.role.name;
            state.permissions = data.role.rights;
        }
    }
});
export function isLogin() {
    return store.state.userId;
}
export function getMenu(path, isId) {
    return findMenu(store.state.menus, path, isId);
}
export function hasPermission(fingerprint) {
    return store.state.permissions.some(function (item) {
        return item === fingerprint;
    });
}
export default store;
//# sourceMappingURL=store.js.map
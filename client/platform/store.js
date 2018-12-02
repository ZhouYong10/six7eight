import Vue from "vue";
import Vuex from "vuex";
import Storage, { StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate } from "@/utils";
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
            state.user.role.rights.unshift(type.id);
            addTypeToMenu(state.rights, type);
        },
        addProductToMenu: function (state, data) {
            var treeRights = state.rights, typeId = data.typeId, product = data.product;
            addProductToMenu(treeRights, typeId, product);
            var rights = state.user.role.rights;
            for (var i = 0; i < rights.length; i++) {
                if (rights[i] === typeId) {
                    rights.splice(i, 1);
                    break;
                }
            }
            rights.unshift(product.id);
        },
        typeOrProductUpdate: function (state, data) {
            typeOrProductUpdate(state.rights, data);
        },
        changeRights: function (state, data) {
            state.rights = data.menuRights;
            state.user.role.name = data.roleName;
            state.user.role.rights = data.rights;
        },
        changeUserState: function (state, userState) {
            state.user.state = userState;
        },
        changeUserRole: function (state, data) {
            state.rights = data.menuRights;
            state.user.role = data.role;
        }
    }
});
export function isLogin() {
    return store.state.userId;
}
export function getMenu(path, isId) {
    function findMenu(menus, path, isId) {
        for (var i = 0; i < menus.length; i++) {
            var item = menus[i];
            if ((!isId && item.path === path) || (isId && item.id === path)) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                var menu = findMenu(item.children, path, isId);
                if (menu) {
                    return menu;
                }
            }
        }
    }
    return findMenu(store.state.menus, path, isId);
}
export function hasPermission(fingerprint) {
    return store.state.permissions.some(function (item) {
        return item === fingerprint;
    });
}
export default store;
//# sourceMappingURL=store.js.map
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
        saveInfo: function (state, data) {
            Vue.set(state, 'user', data.user);
            Vue.set(state, 'rights', data.rights);
        },
        logout: function (state) {
            state = null;
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
export function getMenu(path) {
    function findMenu(menus, path) {
        for (var i = 0; i < menus.length; i++) {
            var item = menus[i];
            console.log(item, ' 111111111111111111111111111');
            if (item.path === path) {
                return item;
            }
            if (item.type === 'menuGroup') {
                var menu = findMenu(item.children, path);
                if (menu) {
                    return menu;
                }
            }
        }
    }
    return findMenu(store.state.rights, path);
}
export function hasPermission(fingerprint) {
    // console.log(store.state.rights, ' ======================');
    store.state.user.role.rights.some(function (item) {
        console.log(item, ' ===================');
        return item === fingerprint;
    });
}
export default store;
//# sourceMappingURL=store.js.map
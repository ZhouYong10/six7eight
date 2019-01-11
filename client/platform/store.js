import Vue from "vue";
import Vuex from "vuex";
import { addTypeToMenu, addProductToMenu, typeOrProductUpdate, findMenu, changeMenuWaitCount } from "@/utils";
import { StorageKey, Storage } from "@/slfstorage";
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
            Vue.set(state, 'magProducts', data.magProducts);
            Vue.set(state, 'platformName', data.platformName);
            Vue.set(state, 'baseFunds', data.baseFunds);
            Vue.set(state, 'profit', data.profit);
        },
        logout: function (state) {
            Storage.removeItem(StorageKey.platform);
        },
        platformChangeFunds: function (state, data) {
            state.baseFunds = data.baseFunds;
            state.profit = data.profit;
        },
        plusBadge: function (state, aim) {
            changeMenuWaitCount(state.menus, aim, function (itemA, itemB) {
                itemA.waitCount++;
                if (itemB) {
                    itemB.waitCount++;
                }
            });
        },
        plusOrderErrorBadge: function (state, data) {
            if (state.magProducts.includes(data.productId)) {
                changeMenuWaitCount(state.menus, data.fingerprint, function (itemA, itemB) {
                    itemA.waitCount++;
                    if (itemB) {
                        itemB.waitCount++;
                    }
                });
            }
        },
        minusBadge: function (state, aim) {
            changeMenuWaitCount(state.menus, aim, function (itemA, itemB) {
                itemA.waitCount = itemA.waitCount > 0 ? --itemA.waitCount : 0;
                if (itemB) {
                    itemB.waitCount = itemB.waitCount > 0 ? --itemB.waitCount : 0;
                }
            });
        },
        minusOrderErrorBadge: function (state, data) {
            if (state.magProducts.includes(data.productId)) {
                changeMenuWaitCount(state.menus, data.fingerprint, function (itemA, itemB) {
                    itemA.waitCount = itemA.waitCount > 0 ? --itemA.waitCount : 0;
                    if (itemB) {
                        itemB.waitCount = itemB.waitCount > 0 ? --itemB.waitCount : 0;
                    }
                });
            }
        },
        addTypeToMenu: function (state, type) {
            state.permissions.unshift(type.id);
            addTypeToMenu(state.menus, type);
        },
        addProductToMenu: function (state, data) {
            var product = data.product;
            state.magProducts.push(product.id);
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
        },
        changePlatformName: function (state, name) {
            state.platformName = name;
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
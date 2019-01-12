import Vue from "vue";
import Vuex from "vuex";
import {addTypeToMenu, addProductToMenu, typeOrProductUpdate, findMenu, changeMenuWaitCount} from "@/utils";
import {StorageKey, Storage} from "@/slfstorage";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let info = Storage.getItem(StorageKey.platform);
        return info ? info : {};
    })(),
    mutations: {
        login(state, data) {
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
        logout(state) {
            Storage.removeItem(StorageKey.platform);
        },
        platformChangeFunds(state, data) {
            state.baseFunds = data.baseFunds;
            state.profit = data.profit;
        },
        plusBadge(state, aim) {
            changeMenuWaitCount(state.menus, aim, (itemA: any, itemB: any) => {
                itemA.waitCount++;
                if (itemB) {
                    itemB.waitCount++;
                }
            });
        },
        plusOrderErrorBadge(state, data) {
            if (state.magProducts.includes(data.productId)) {
                changeMenuWaitCount(state.menus, data.fingerprint, (itemA: any, itemB: any) => {
                    itemA.waitCount++;
                    if (itemB) {
                        itemB.waitCount++;
                    }
                });
            }
        },
        minusBadge(state, aim) {
            changeMenuWaitCount(state.menus, aim, (itemA: any, itemB: any) => {
                itemA.waitCount = itemA.waitCount > 0 ? --itemA.waitCount : 0;
                if (itemB) {
                    itemB.waitCount = itemB.waitCount > 0 ? --itemB.waitCount : 0;
                }
            });
        },
        minusOrderErrorBadge(state, data) {
            if (state.magProducts.includes(data.productId)) {
                changeMenuWaitCount(state.menus, data.fingerprint, (itemA: any, itemB: any) => {
                    itemA.waitCount = itemA.waitCount > 0 ? --itemA.waitCount : 0;
                    if (itemB) {
                        itemB.waitCount = itemB.waitCount > 0 ? --itemB.waitCount : 0;
                    }
                });
            }
        },
        addTypeToMenu(state, type) {
            state.permissions.unshift(type.id);
            addTypeToMenu(state.menus, type);
        },
        addProductToMenu(state, data) {
            let product = data.product;
            state.magProducts.push(product.id);
            addProductToMenu(state.menus, data.typeId, product);
            state.permissions.unshift(product.id);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.menus, data);
        },
        changeRights(state, data) {
            state.menus = data.menuRights;
            state.roleName = data.roleName;
            state.permissions = data.rights;
        },
        changeUserState(state, userState) {
            state.userState = userState;
        },
        changeUserRole(state, data) {
            state.menus = data.menuRights;
            state.roleId = data.role.id;
            state.roleType = data.role.type;
            state.roleName = data.role.name;
            state.permissions = data.role.rights;
        },
        changePlatformName(state, name) {
            state.platformName = name;
        }
    }
});

export function logout() {
    store.commit('logout');
}

export function isLogin() {
    return store.state.userId;
}

export function getMenu(path: string, isId: boolean) {
    return findMenu(store.state.menus, path, isId);
}

export function hasPermission(fingerprint: string) {
    return store.state.permissions.some((item:string) => {
        return item === fingerprint;
    });
}

export default store;
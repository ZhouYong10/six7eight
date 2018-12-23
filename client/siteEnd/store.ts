import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate, findMenu, changeMenuWaitCount} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let info = Storage.getItem(StorageKey.site);
        return info ? info : {};
    })(),
    mutations: {
        login(state, data) {
            Vue.set(state, 'userId', data.userId);
            Vue.set(state, 'username', data.username);
            Vue.set(state, 'userState', data.userState);
            Vue.set(state, 'roleId', data.roleId);
            Vue.set(state, 'roleName', data.roleName);
            Vue.set(state, 'roleType', data.roleType);
            Vue.set(state, 'permissions', data.permissions);
            Vue.set(state, 'menus', data.menus);
            Vue.set(state, 'magProducts', data.magProducts);
            Vue.set(state, 'siteId', data.siteId);
            Vue.set(state, 'siteName', data.siteName);
            Vue.set(state, 'funds', data.funds);
            Vue.set(state, 'freezeFunds', data.freezeFunds);
            Vue.set(state, 'messageNum', data.messageNum);
        },
        logout(state) {
            Storage.removeItem(StorageKey.site);
        },
        changeMessageNum(state, messageNum) {
            state.messageNum = messageNum;
        },
        minusMessageNum(state) {
            state.messageNum -= 1;
        },
        plusMessageNum(state) {
            state.messageNum += 1;
        },
        plusBadge(state, aim) {
            changeMenuWaitCount(state.menus, aim, (itemA:any, itemB:any) => {
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
            changeMenuWaitCount(state.menus, aim, (itemA:any, itemB:any) => {
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
        changeSiteName(state, siteName) {
            state.siteName = siteName;
        },
        addTypeToMenu(state, type) {
            state.permissions.unshift(type.id);
            addTypeToMenu(state.menus, type);
        },
        addProductToMenu(state, data) {
            let product = data.product;
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
        changeFunds(state, funds) {
            state.funds = funds;
        },
        changeFreezeFunds(state, freezeFunds) {
            state.freezeFunds = freezeFunds;
        },
        changeFundsAndFreezeFunds(state, data) {
            state.funds = data.funds;
            state.freezeFunds = data.freezeFunds;
        }
    }
});

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
import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate, findMenu} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let state = Storage.getItem(StorageKey.user);
        return state ? state : {};
    })(),
    mutations: {
        saveInitData(state, data) {
            Vue.set(state, 'siteId', data.siteId);
            Vue.set(state, 'siteName', data.siteName);
            Vue.set(state, 'productMenus', data.productMenus);
            Vue.set(state, 'rightMenus', data.rightMenus);
        },
        login(state, data) {
            Vue.set(state, 'userId', data.userId);
            Vue.set(state, 'username', data.username);
            Vue.set(state, 'userState', data.userState);
            Vue.set(state, 'funds', data.funds);
            Vue.set(state, 'freezeFunds', data.freezeFunds);
            Vue.set(state, 'roleId', data.roleId);
            Vue.set(state, 'roleType', data.roleType);
            Vue.set(state, 'roleName', data.roleName);
            Vue.set(state, 'permissions', data.permissions);
            Vue.set(state, 'rightMenus', data.rightMenus);
        },
        logout(state, data) {
            state.userId = null;
            state.username = null;
            state.userState = null;
            state.funds = null;
            state.freezeFunds = null;
            state.roleId = null;
            state.roleName = null;
            state.permissions = null;
            state.rightMenus = data.rightMenus;
        },
        changeSiteName(state, siteName) {
            state.siteName = siteName;
        },
        orderChangeUserFunds(state, data){
            state.funds = data.funds;
            state.freezeFunds = data.freezeFunds;
        },
        addTypeToMenu(state, type) {
            addTypeToMenu(state.productMenus, type);
        },
        addProductToMenu(state, data) {
            addProductToMenu(state.productMenus, data.typeId, data.product);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.productMenus, data);
        },
        changeRights(state, data) {
            state.rightMenus = data.menuRights;
            state.roleName = data.roleName;
            state.permissions = data.rights;
        },
        changeUserFunds(state, funds) {
            state.funds = funds;
        },
        changeFreezeFunds(state, freezeFunds) {
            state.freezeFunds = freezeFunds;
        },
        changeFundsAndFreezeFunds(state, data) {
            state.funds = data.funds;
            state.freezeFunds = data.freezeFunds;
        },
        changeUserState(state, userState) {
            state.userState = userState;
        },
    }
});

export function logout(data:any) {
    store.commit('logout', data);
}

export function isLogin() {
    return store.state.userId;
}

export function getMenu(path: string, isId: boolean) {
    let state = store.state;
    return findMenu(state.rightMenus.concat(state.productMenus), path, isId);
}

export function hasPermission(fingerprint: string) {
    return store.state.permissions.some((item:string) => {
        return item === fingerprint;
    });
}

export default store;
import Vuex from "vuex";
import Vue from "vue";
import {addTypeToMenu, addProductToMenu, typeOrProductUpdate, findMenu} from "@/utils";
import {StorageKey, Storage} from "@/slfstorage";
import {sortProductMenus} from "../commons/utils";

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
            Vue.set(state, 'permissions', data.permissions);
            Vue.set(state, 'canSiteRegister', data.canSiteRegister);
            Vue.set(state, 'canRegister', data.canRegister);
            Vue.set(state, 'canAddUser', data.canAddUser);
            sortProductMenus(state.productMenus);
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
            Vue.set(state, 'productMenus', data.productMenus);
            Vue.set(state, 'messageNum', data.messageNum);
            sortProductMenus(state.productMenus);
        },
        logout(state, data) {
            state.userId = null;
            state.username = null;
            state.userState = null;
            state.funds = null;
            state.freezeFunds = null;
            state.roleId = null;
            state.roleType = null;
            state.roleName = null;
            state.productMenus = data.productMenus;
            state.permissions = data.permissions;
            state.rightMenus = data.rightMenus;
            sortProductMenus(state.productMenus);
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
        changeCanSiteRegister(state, canSiteRegister) {
            state.canSiteRegister = canSiteRegister;
        },
        changePlatformInfo(state, data) {
            state.canRegister = data.canRegister;
            state.canAddUser = data.canAddUser;
        },
        changeSiteName(state, siteName) {
            state.siteName = siteName;
        },
        addTypeToMenu(state, type) {
            addTypeToMenu(state.productMenus, type);
            sortProductMenus(state.productMenus);
        },
        addProductToMenu(state, data) {
            addProductToMenu(state.productMenus, data.typeId, data.product);
            sortProductMenus(state.productMenus);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.productMenus, data);
            sortProductMenus(state.productMenus);
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
        userUpRole(state, data) {
            state.funds = data.userFunds;
            state.roleId = data.roleId;
            state.roleName = data.roleName;
            state.roleType = data.roleType;
            state.permissions = data.permissions;
            state.rightMenus = data.rightMenus;
        }
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
    if (state.rightMenus) {
        return findMenu(state.rightMenus.concat(state.productMenus), path, isId);
    }else {
        return false;
    }
}

export function hasPermission(fingerprint: string) {
    return store.state.permissions.some((item:string) => {
        return item === fingerprint;
    });
}

export default store;
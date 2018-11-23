import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate} from "@/utils";

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
            Vue.set(state, 'typeRights', data.typeRights);
            Vue.set(state, 'rights', data.rights);
        },
        saveUser(state, data) {
            Vue.set(state, 'user', data.user);
            Vue.set(state, 'rights', data.rights);
        },
        logout(state, data) {
            state.user = null;
            state.siteId = data.siteId;
            state.siteName = data.siteName;
            state.typeRights = data.typeRights;
            state.rights = data.rights;
        },
        updateUsername(state, username) {
            state.user.username = username;
        },
        addTypeToMenu(state, type) {
            addTypeToMenu(state.typeRights, type);
        },
        addProductToMenu(state, data) {
            addProductToMenu(state.typeRights, data.typeId, data.product);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.typeRights, data);
        },
        changeRights(state, data) {
            state.rights = data.menuRights;
            state.user.role.name = data.roleName;
            state.user.role.rights = data.rights;
        },
        changeUserFunds(state, funds) {
            state.user.funds = funds;
        },
        changeUserState(state, userState) {
            state.user.state = userState;
        },
        changeContact(state, contact) {
            state.user.phone = contact.phone;
            state.user.weixin = contact.weixin;
            state.user.qq = contact.qq;
            state.user.email = contact.email;
        }
    }
});

export default store;
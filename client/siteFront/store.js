import Vuex from "vuex";
import Vue from "vue";
import Storage, { StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate } from "@/utils";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: (function () {
        var state = Storage.getItem(StorageKey.user);
        return state ? state : {};
    })(),
    mutations: {
        saveInitData: function (state, data) {
            Vue.set(state, 'siteId', data.siteId);
            Vue.set(state, 'siteName', data.siteName);
            Vue.set(state, 'typeRights', data.typeRights);
            Vue.set(state, 'rights', data.rights);
        },
        login: function (state, data) {
            Vue.set(state, 'user', data.user);
            Vue.set(state, 'rights', data.rights);
        },
        logout: function (state, data) {
            state.user = null;
            state.siteId = data.siteId;
            state.siteName = data.siteName;
            state.typeRights = data.typeRights;
            state.rights = data.rights;
        },
        orderChangeUserFunds: function (state, data) {
            state.user.funds = data.funds;
            state.user.freezeFunds = data.freezeFunds;
        },
        updateUsername: function (state, username) {
            state.user.username = username;
        },
        addTypeToMenu: function (state, type) {
            addTypeToMenu(state.typeRights, type);
        },
        addProductToMenu: function (state, data) {
            addProductToMenu(state.typeRights, data.typeId, data.product);
        },
        typeOrProductUpdate: function (state, data) {
            typeOrProductUpdate(state.typeRights, data);
        },
        changeRights: function (state, data) {
            state.rights = data.menuRights;
            state.user.role.name = data.roleName;
            state.user.role.rights = data.rights;
        },
        changeUserFunds: function (state, funds) {
            state.user.funds = funds;
        },
        changeUserState: function (state, userState) {
            state.user.state = userState;
        },
        changeContact: function (state, contact) {
            state.user.phone = contact.phone;
            state.user.weixin = contact.weixin;
            state.user.qq = contact.qq;
            state.user.email = contact.email;
        }
    }
});
export default store;
//# sourceMappingURL=store.js.map
"use strict";
const vuex_1 = require("vuex");
const utils_1 = require("@/utils");
const window = require("@/window");
const store = new vuex_1.default.Store({
    state: {
        info: (() => {
            let info = JSON.parse(window.sessionStorage.getItem(utils_1.StorageKey.platform));
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo(state, data) {
            state.info = {
                user: data
            };
            window.sessionStorage.setItem(utils_1.StorageKey.platform, JSON.stringify(state.info));
        },
        changeUser(state, user) {
            state.info.user = user;
        }
    }
});
module.exports = store;
//# sourceMappingURL=store.js.map
import Vuex from "vuex";
import {StorageKey} from "@/utils";
import window = require("@/window");


const store = new Vuex.Store({
    state: {
        info: (() => {
            let info = JSON.parse(window.sessionStorage.getItem(StorageKey.platform));
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo(state, data) {
            state.info = {
                user: data
            };
            window.sessionStorage.setItem(StorageKey.platform, JSON.stringify(state.info));
        },
        changeUser(state, user) {
            state.info.user = user;
        }
    }
});

export = store;
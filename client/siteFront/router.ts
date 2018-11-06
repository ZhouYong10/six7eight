
import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import Storage, {parseRightsToRoutes, StorageKey} from "@/utils";
import {axiosGet} from "@/*";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: compObj.home},
        {
            path: '/', component: compObj.home,
            children: [
                {path: '', component: compObj.index},
                {path: 'selfInfo', component: compObj.myInfo},
                ...getRoutes()
            ]
        }
    ]
});

function getRoutes() {
    let state = Storage.getItem(StorageKey.user);
    if (state && state.rights) {
        return parseRightsToRoutes(state.rights, compObj);
    } else {
        return [];
    }
}


export default router;
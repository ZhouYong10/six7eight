import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import Storage, { parseRightsToRoutes, StorageKey } from "@/utils";
Vue.use(VueRouter);
var router = new VueRouter({
    routes: [
        { path: '*', component: compObj.home },
        {
            path: '/', component: compObj.home,
            children: [
                { path: '', component: compObj.index },
                { path: 'selfInfo', component: compObj.myInfo }
            ].concat(getRoutes())
        }
    ]
});
function getRoutes() {
    var state = Storage.getItem(StorageKey.user);
    if (state && state.initData) {
        return parseRightsToRoutes(state.initData.rights, compObj);
    }
    else {
        return [];
    }
}
export default router;
//# sourceMappingURL=router.js.map
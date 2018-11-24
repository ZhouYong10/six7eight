import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import Storage, { parseRightsToRoutes, StorageKey } from "@/utils";
Vue.use(VueRouter);
var router = new VueRouter({
    routes: [
        { path: '*', component: compObj.noPage },
        {
            path: '/', component: compObj.home,
            children: [
                { path: '', component: compObj.index },
                { path: 'selfInfo', component: compObj.myInfo },
                { path: 'product/:id', component: compObj.product, props: true }
            ].concat(getRoutes())
        }
    ]
});
function getRoutes() {
    var state = Storage.getItem(StorageKey.user);
    if (state && state.rights) {
        return parseRightsToRoutes(state.rights, compObj);
    }
    else {
        return [];
    }
}
export default router;
//# sourceMappingURL=router.js.map
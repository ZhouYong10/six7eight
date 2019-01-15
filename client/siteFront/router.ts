import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import {axiosGet} from "@/slfaxios";
import {window} from "@/window";
import {Message, MessageBox} from "element-ui";
import {getMenu, hasPermission, isLogin} from "./store";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', redirect: '/'},
        {
            path: '/', component: compObj.home,
            children: [
                {path: '', component: compObj.index, meta: {title: '公告'}},
                {path: 'self/info', component: compObj.myInfo, meta: {title: '账户信息'}},
                {path: 'product/:id', component: compObj.product},
                {path: 'recharge/records', component: compObj.rechargeRecord},
                {path: 'consume/records', component: compObj.fundsRecord},
                {path: 'profit/records', component: compObj.profitRecord},
                {path: 'withdraw/records', component: compObj.withdrawRecord},
                {path: 'user/role/up', component: compObj.roleUp},
                {path: 'lower/user', component: compObj.lowerUsers},
                {path: 'feedback/records', component: compObj.feedback},
            ]
        }
    ]
});

const whitePath = [
    '/',
    '/self/info',
];
router.beforeEach(async (to, from, next) => {
    let path = to.path;
    if (path === '/') {
        window.document.title = to.meta.title;
        next();
    } else {
        if (whitePath.some(item => item === path)) {
            window.document.title = to.meta.title;
            next();
        }else{
            let menu;
            let productId = to.params.id;
            if (productId) {
                menu = getMenu(productId, true);
            }else{
                menu = getMenu(path, false);
            }
            if (menu) {
                window.document.title = menu.name;
                if (isLogin()) {
                    if (productId) {
                        next();
                    }else{
                        if (hasPermission(menu.fingerprint)) {
                            next();
                        }else{
                            Message.error('您访问的地址不存在或没有访问权限！');
                            next('/');
                        }
                    }
                }else{
                    next();
                }
            }else{
                next('/');
            }
        }
    }
});

router.onError((error:any) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    if (isChunkLoadFailed) {
        MessageBox.confirm('服务器版本已更新，请刷新本地缓存!', '版本更新', {
            confirmButtonText: '确定',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal:false,
            type: 'warning',
            center: true
        }).then(() => {
            window.location.reload();
        });
    }
});

export default router;
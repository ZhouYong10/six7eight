import {UserAdmin} from "./entity/UserAdmin";
import {RoleUserAdmin} from "./entity/RoleUserAdmin";
import debuger = require("debug");
import {RightAdmin} from "./entity/RightAdmin";
import {RightType} from "./entity/RightBase";
import set = Reflect.set;

const debug = debuger('six7eight:initDataBase');


(async () => {
    let roleUserAdmin = await RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin();
        roleUserAdmin.name = '开发者';
        roleUserAdmin.rights = [
            [{
            id: "4b9dbe06-e803-468e-b870-80246afc9455",
            type: "page",
            name: "平台管理",
            componentName: "home",
            icon: null,
            children: [{
                id: "01d5eac2-512f-4a46-a859-a63114935a7e",
                type: "menuGroup",
                name: "商品管理",
                componentName: null,
                icon: "el-icon-goods",
                children: [{
                    id: "52590ffe-cba0-4740-9d9e-cc8340af342a",
                    type: "page",
                    name: "分类列表",
                    componentName: "productTypes",
                    icon: null,
                    children: [],
                    "saved": true
                }, {
                    id: "7c23a660-2946-450c-99e9-7f570b9675c2",
                    type: "page",
                    name: "所有商品",
                    componentName: "productAll",
                    icon: null,
                    children: [],
                    "saved": true
                }],
                "saved": true
            }, {
                id: "0b109da5-699f-4b8d-9056-5d8524ee961c",
                type: "page",
                name: "账户详情",
                componentName: "adminInfo",
                icon: null,
                children: [],
                "saved": true
            }, {
                id: "1d5c8b61-c1e4-451c-9cf2-6559797751b1",
                type: "page",
                name: "后台首页",
                componentName: "index",
                icon: null,
                children: [],
                "saved": true
            }, {
                id: "4b73273a-33a0-4809-914e-15304b7b6fd7",
                type: "menuGroup",
                name: "问题反馈",
                componentName: null,
                icon: "el-icon-question",
                children: [{
                    id: "a9167b1a-e7fc-4b3e-b151-fb48fc1e85ae",
                    type: "page",
                    name: "用户反馈",
                    componentName: "feedbackUser",
                    icon: null,
                    children: [],
                    "saved": true
                }, {
                    id: "f616646a-ddb7-43f8-8997-8bc81c94cde3",
                    type: "page",
                    name: "站点反馈",
                    componentName: "feedbackSite",
                    icon: null,
                    children: [],
                    "saved": true
                }],
                "saved": true
            }, {
                id: "4be6120e-33f7-456d-a562-29cdf000991d",
                type: "page",
                name: "订单报错",
                componentName: "orderError",
                icon: "el-icon-document",
                children: [],
                "saved": true
            }, {
                id: "80053403-a7fa-4e47-91e3-4364b1793d96",
                type: "menuGroup",
                name: "资金管理",
                componentName: null,
                icon: "el-icon-star-on",
                children: [{
                    id: "53c99c6b-da7e-4f9e-812a-8af89dc8ba33",
                    type: "page",
                    name: "充值记录",
                    componentName: "recharge",
                    icon: null,
                    children: [],
                    "saved": true
                }, {
                    id: "fcc91496-99cc-4d6a-bee5-f843d296f16f",
                    type: "page",
                    name: "提现记录",
                    componentName: "withdraw",
                    icon: null,
                    children: [],
                    "saved": true
                }],
                "saved": true
            }, {
                id: "c449f895-bc51-42fa-84df-f4697fdf46e9",
                type: "menuGroup",
                name: "系统设置",
                componentName: null,
                icon: "el-icon-setting",
                children: [{
                    id: "582af854-3174-47d8-a91c-2b3358110c4d",
                    type: "page",
                    name: "权限管理",
                    componentName: "right",
                    icon: null,
                    children: [],
                    "saved": true
                }],
                "saved": true
            }, {
                id: "cffe8d39-200d-4aa9-bd9e-84f87c8780e5",
                type: "menuGroup",
                name: "系统管理员",
                componentName: null,
                icon: "el-icon-service",
                children: [{
                    id: "8a6365b4-7694-4875-90dc-13aa572b8f84",
                    type: "page",
                    name: "角色管理",
                    componentName: "adminsRole",
                    icon: null,
                    children: [],
                    "saved": true
                }, {
                    id: "b0f07f6e-abbb-43e0-a3aa-4cef4f2da7ca",
                    type: "page",
                    name: "管理员列表",
                    componentName: "adminsList",
                    icon: null,
                    children: [],
                    "saved": true
                }],
                "saved": true
            }, {
                id: "f20f4c03-addb-41ca-ab72-1927bc8a2a4b",
                type: "menuGroup",
                name: "公告管理",
                componentName: null,
                icon: "el-icon-message",
                children: [{
                    id: "584d3743-c98a-402c-a7d0-2544879f2221",
                    type: "page",
                    name: "平台公告",
                    componentName: "placardsPlatform",
                    icon: null,
                    children: [],
                    "saved": true
                }, {
                    id: "6bf480de-ace2-4d5e-80f7-1eea2754ba07",
                    type: "page",
                    name: "分站公告",
                    componentName: "placardsSite",
                    icon: null,
                    children: [],
                    "saved": true
                }],
                "saved": true
            }, {
                id: "f4ef26c7-9386-4bd6-9fc1-06840056e151",
                type: "menuGroup",
                name: "分站管理",
                componentName: null,
                icon: "el-icon-rank",
                children: [{
                    id: "0443d219-b5d7-416d-b03e-5597d2c5f660",
                    type: "page",
                    name: "新建分站",
                    componentName: "addSite",
                    icon: null,
                    children: [],
                    "saved": true
                }, {
                    id: "629b7851-8c73-4bf8-afb9-885f9e426ce4",
                    type: "page",
                    name: "分站列表",
                    componentName: "sites",
                    icon: null,
                    children: [],
                    "saved": true
                }],
                "saved": true
            }],
            "saved": true
        }], [{
            id: "52590ffe-cba0-4740-9d9e-cc8340af342a",
            type: "page",
            name: "分类列表",
            componentName: "productTypes",
            icon: null,
            children: []
        }, {
            id: "7c23a660-2946-450c-99e9-7f570b9675c2",
            type: "page",
            name: "所有商品",
            componentName: "productAll",
            icon: null,
            children: []
        }, {
            id: "0b109da5-699f-4b8d-9056-5d8524ee961c",
            type: "page",
            name: "账户详情",
            componentName: "adminInfo",
            icon: null,
            children: []
        }, {
            id: "1d5c8b61-c1e4-451c-9cf2-6559797751b1",
            type: "page",
            name: "后台首页",
            componentName: "index",
            icon: null,
            children: []
        }, {
            id: "a9167b1a-e7fc-4b3e-b151-fb48fc1e85ae",
            type: "page",
            name: "用户反馈",
            componentName: "feedbackUser",
            icon: null,
            children: []
        }, {
            id: "f616646a-ddb7-43f8-8997-8bc81c94cde3",
            type: "page",
            name: "站点反馈",
            componentName: "feedbackSite",
            icon: null,
            children: []
        }, {
            id: "4be6120e-33f7-456d-a562-29cdf000991d",
            type: "page",
            name: "订单报错",
            componentName: "orderError",
            icon: "el-icon-document",
            children: []
        }, {
            id: "53c99c6b-da7e-4f9e-812a-8af89dc8ba33",
            type: "page",
            name: "充值记录",
            componentName: "recharge",
            icon: null,
            children: []
        }, {
            id: "fcc91496-99cc-4d6a-bee5-f843d296f16f",
            type: "page",
            name: "提现记录",
            componentName: "withdraw",
            icon: null,
            children: []
        }, {
            id: "582af854-3174-47d8-a91c-2b3358110c4d",
            type: "page",
            name: "权限管理",
            componentName: "right",
            icon: null,
            children: []
        }, {
            id: "8a6365b4-7694-4875-90dc-13aa572b8f84",
            type: "page",
            name: "角色管理",
            componentName: "adminsRole",
            icon: null,
            children: []
        }, {
            id: "b0f07f6e-abbb-43e0-a3aa-4cef4f2da7ca",
            type: "page",
            name: "管理员列表",
            componentName: "adminsList",
            icon: null,
            children: []
        }, {
            id: "584d3743-c98a-402c-a7d0-2544879f2221",
            type: "page",
            name: "平台公告",
            componentName: "placardsPlatform",
            icon: null,
            children: []
        }, {
            id: "6bf480de-ace2-4d5e-80f7-1eea2754ba07",
            type: "page",
            name: "分站公告",
            componentName: "placardsSite",
            icon: null,
            children: []
        }, {
            id: "0443d219-b5d7-416d-b03e-5597d2c5f660",
            type: "page",
            name: "新建分站",
            componentName: "addSite",
            icon: null,
            children: []
        }, {
            id: "629b7851-8c73-4bf8-afb9-885f9e426ce4",
            type: "page",
            name: "分站列表",
            componentName: "sites",
            icon: null,
            children: []
        }]];
        let roleUserAdminSaved = await roleUserAdmin.save();
        debug(JSON.stringify(roleUserAdminSaved) + ' 插入数据库成功！！');
    }
    let userAdmin = await UserAdmin.findByName('admin');
    if (!userAdmin) {
        userAdmin = new UserAdmin();
        userAdmin.username = 'admin';
        userAdmin.password = 'admin';
        userAdmin.qq = '123545432';
        userAdmin.phone = '13578906543';
        userAdmin.weixin = 'fadf3123123';
        userAdmin.email = 'admin@email.com';
        userAdmin.role = roleUserAdmin;
        let userAdminSaved = await userAdmin.save();
        debug(JSON.stringify(userAdminSaved) + ' 插入数据库成功！！');
    }

    let rightAdminTree = await RightAdmin.findTrees();
    if (rightAdminTree.length < 1) {
        let platform = new RightAdmin();
        platform.name = '平台管理';
        platform.type = RightType.Page;
        platform.componentName = 'home';
        let platformSaved = await platform.save();

        let index = new RightAdmin();
        index.name = '后台首页';
        index.type = RightType.Page;
        index.componentName = 'index';
        index.parent = platformSaved;
        let indexSaved = await index.save();

        let adminInfo = new RightAdmin();
        adminInfo.name = '账户详情';
        adminInfo.type = RightType.Page;
        adminInfo.componentName = 'adminInfo';
        adminInfo.parent = platformSaved;
        let adminInfoSaved = await adminInfo.save();

        let orderError = new RightAdmin();
        orderError.name = '订单报错';
        orderError.type = RightType.Page;
        orderError.componentName = 'orderError';
        orderError.icon = 'el-icon-document';
        orderError.parent = platformSaved;
        let orderErrorSaved = await orderError.save();

        let fundsMenu = new RightAdmin();
        fundsMenu.name = '资金管理';
        fundsMenu.type = RightType.MenuGroup;
        fundsMenu.icon = 'el-icon-star-on';
        fundsMenu.parent = platformSaved;
        let fundsMenuSaved = await fundsMenu.save();

        let recharge = new RightAdmin();
        recharge.name = '充值记录';
        recharge.type = RightType.Page;
        recharge.componentName = 'recharge';
        recharge.parent = fundsMenuSaved;
        let rechargeSaved = await recharge.save();

        let withdraw = new RightAdmin();
        withdraw.name = '提现记录';
        withdraw.type = RightType.Page;
        withdraw.componentName = 'withdraw';
        withdraw.parent = fundsMenuSaved;
        let withdrawSaved = await withdraw.save();

        let productMenu = new RightAdmin();
        productMenu.name = '商品管理';
        productMenu.type = RightType.MenuGroup;
        productMenu.icon = 'el-icon-goods';
        productMenu.parent = platformSaved;
        let productMenuSaved = await productMenu.save();

        let productTypes = new RightAdmin();
        productTypes.name = '分类列表';
        productTypes.type = RightType.Page;
        productTypes.componentName = 'productTypes';
        productTypes.parent = productMenuSaved;
        let productTypesSaved = await productTypes.save();

        let productAll = new RightAdmin();
        productAll.name = '所有商品';
        productAll.type = RightType.Page;
        productAll.componentName = 'productAll';
        productAll.parent = productMenuSaved;
        let productAllSaved = await productAll.save();

        let placardsMenu = new RightAdmin();
        placardsMenu.name = '公告管理';
        placardsMenu.type = RightType.MenuGroup;
        placardsMenu.icon = 'el-icon-message';
        placardsMenu.parent = platformSaved;
        let placardsMenuSaved = await placardsMenu.save();

        let placardsPlatform = new RightAdmin();
        placardsPlatform.name = '平台公告';
        placardsPlatform.type = RightType.Page;
        placardsPlatform.componentName = 'placardsPlatform';
        placardsPlatform.parent = placardsMenuSaved;
        let placardsPlatformSaved = await placardsPlatform.save();

        let placardsSite = new RightAdmin();
        placardsSite.name = '分站公告';
        placardsSite.type = RightType.Page;
        placardsSite.componentName = 'placardsSite';
        placardsSite.parent = placardsMenuSaved;
        let placardsSiteSaved = await placardsSite.save();

        let siteMenu = new RightAdmin();
        siteMenu.name = '分站管理';
        siteMenu.type = RightType.MenuGroup;
        siteMenu.icon = 'el-icon-rank';
        siteMenu.parent = platformSaved;
        let siteMenuSaved = await siteMenu.save();

        let addSite = new RightAdmin();
        addSite.name = '新建分站';
        addSite.type = RightType.Page;
        addSite.componentName = 'addSite';
        addSite.parent = siteMenuSaved;
        let addSiteSaved = await addSite.save();

        let sites = new RightAdmin();
        sites.name = '分站列表';
        sites.type = RightType.Page;
        sites.componentName = 'sites';
        sites.parent = siteMenuSaved;
        let sitesSaved = await sites.save();

        let feedbackMenu = new RightAdmin();
        feedbackMenu.name = '问题反馈';
        feedbackMenu.type = RightType.MenuGroup;
        feedbackMenu.icon = 'el-icon-question';
        feedbackMenu.parent = platformSaved;
        let feedbackMenuSaved = await feedbackMenu.save();

        let feedbackSite = new RightAdmin();
        feedbackSite.name = '站点反馈';
        feedbackSite.type = RightType.Page;
        feedbackSite.componentName = 'feedbackSite';
        feedbackSite.parent = feedbackMenuSaved;
        let feedbackSiteSaved = await feedbackSite.save();

        let feedbackUser = new RightAdmin();
        feedbackUser.name = '用户反馈';
        feedbackUser.type = RightType.Page;
        feedbackUser.componentName = 'feedbackUser';
        feedbackUser.parent = feedbackMenuSaved;
        let feedbackUserSaved = await feedbackUser.save();

        let adminMenu = new RightAdmin();
        adminMenu.name = '系统管理员';
        adminMenu.type = RightType.MenuGroup;
        adminMenu.icon = 'el-icon-service';
        adminMenu.parent = platformSaved;
        let adminMenuSaved = await adminMenu.save();

        let adminsRole = new RightAdmin();
        adminsRole.name = '角色管理';
        adminsRole.type = RightType.Page;
        adminsRole.componentName = 'adminsRole';
        adminsRole.parent = adminMenuSaved;
        let adminsRoleSaved = await adminsRole.save();

        let adminsList = new RightAdmin();
        adminsList.name = '管理员列表';
        adminsList.type = RightType.Page;
        adminsList.componentName = 'adminsList';
        adminsList.parent = adminMenuSaved;
        let adminsListSaved = await adminsList.save();

        let settingsMenu = new RightAdmin();
        settingsMenu.name = '系统设置';
        settingsMenu.type = RightType.MenuGroup;
        settingsMenu.icon = 'el-icon-setting';
        settingsMenu.parent = platformSaved;
        let settingsMenuSaved = await settingsMenu.save();

        let right = new RightAdmin();
        right.name = '权限管理';
        right.type = RightType.Page;
        right.componentName = 'right';
        right.parent = settingsMenuSaved;
        let rightSaved = await right.save();


        debug('插入权限数据成功！');
    }
})();



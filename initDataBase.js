"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserAdmin_1 = require("./entity/UserAdmin");
const RoleUserAdmin_1 = require("./entity/RoleUserAdmin");
const debuger = require("debug");
const RightAdmin_1 = require("./entity/RightAdmin");
const RightBase_1 = require("./entity/RightBase");
const debug = debuger('six7eight:initDataBase');
(() => __awaiter(this, void 0, void 0, function* () {
    let roleUserAdmin = yield RoleUserAdmin_1.RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin_1.RoleUserAdmin();
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
                }]
        ];
        let roleUserAdminSaved = yield roleUserAdmin.save();
        debug(JSON.stringify(roleUserAdminSaved) + ' 插入数据库成功！！');
    }
    let userAdmin = yield UserAdmin_1.UserAdmin.findByName('admin');
    if (!userAdmin) {
        userAdmin = new UserAdmin_1.UserAdmin();
        userAdmin.username = 'admin';
        userAdmin.password = 'admin';
        userAdmin.qq = '123545432';
        userAdmin.phone = '13578906543';
        userAdmin.weixin = 'fadf3123123';
        userAdmin.email = 'admin@email.com';
        userAdmin.role = roleUserAdmin;
        let userAdminSaved = yield userAdmin.save();
        debug(JSON.stringify(userAdminSaved) + ' 插入数据库成功！！');
    }
    let rightAdminTree = yield RightAdmin_1.RightAdmin.findTrees();
    if (rightAdminTree.length < 1) {
        let platform = new RightAdmin_1.RightAdmin();
        platform.name = '平台管理';
        platform.type = RightBase_1.RightType.Page;
        platform.componentName = 'home';
        let platformSaved = yield platform.save();
        let index = new RightAdmin_1.RightAdmin();
        index.name = '后台首页';
        index.type = RightBase_1.RightType.Page;
        index.componentName = 'index';
        index.parent = platformSaved;
        let indexSaved = yield index.save();
        let adminInfo = new RightAdmin_1.RightAdmin();
        adminInfo.name = '账户详情';
        adminInfo.type = RightBase_1.RightType.Page;
        adminInfo.componentName = 'adminInfo';
        adminInfo.parent = platformSaved;
        let adminInfoSaved = yield adminInfo.save();
        let orderError = new RightAdmin_1.RightAdmin();
        orderError.name = '订单报错';
        orderError.type = RightBase_1.RightType.Page;
        orderError.componentName = 'orderError';
        orderError.icon = 'el-icon-document';
        orderError.parent = platformSaved;
        let orderErrorSaved = yield orderError.save();
        let fundsMenu = new RightAdmin_1.RightAdmin();
        fundsMenu.name = '资金管理';
        fundsMenu.type = RightBase_1.RightType.MenuGroup;
        fundsMenu.icon = 'el-icon-star-on';
        fundsMenu.parent = platformSaved;
        let fundsMenuSaved = yield fundsMenu.save();
        let recharge = new RightAdmin_1.RightAdmin();
        recharge.name = '充值记录';
        recharge.type = RightBase_1.RightType.Page;
        recharge.componentName = 'recharge';
        recharge.parent = fundsMenuSaved;
        let rechargeSaved = yield recharge.save();
        let withdraw = new RightAdmin_1.RightAdmin();
        withdraw.name = '提现记录';
        withdraw.type = RightBase_1.RightType.Page;
        withdraw.componentName = 'withdraw';
        withdraw.parent = fundsMenuSaved;
        let withdrawSaved = yield withdraw.save();
        let productMenu = new RightAdmin_1.RightAdmin();
        productMenu.name = '商品管理';
        productMenu.type = RightBase_1.RightType.MenuGroup;
        productMenu.icon = 'el-icon-goods';
        productMenu.parent = platformSaved;
        let productMenuSaved = yield productMenu.save();
        let productTypes = new RightAdmin_1.RightAdmin();
        productTypes.name = '分类列表';
        productTypes.type = RightBase_1.RightType.Page;
        productTypes.componentName = 'productTypes';
        productTypes.parent = productMenuSaved;
        let productTypesSaved = yield productTypes.save();
        let productAll = new RightAdmin_1.RightAdmin();
        productAll.name = '所有商品';
        productAll.type = RightBase_1.RightType.Page;
        productAll.componentName = 'productAll';
        productAll.parent = productMenuSaved;
        let productAllSaved = yield productAll.save();
        let placardsMenu = new RightAdmin_1.RightAdmin();
        placardsMenu.name = '公告管理';
        placardsMenu.type = RightBase_1.RightType.MenuGroup;
        placardsMenu.icon = 'el-icon-message';
        placardsMenu.parent = platformSaved;
        let placardsMenuSaved = yield placardsMenu.save();
        let placardsPlatform = new RightAdmin_1.RightAdmin();
        placardsPlatform.name = '平台公告';
        placardsPlatform.type = RightBase_1.RightType.Page;
        placardsPlatform.componentName = 'placardsPlatform';
        placardsPlatform.parent = placardsMenuSaved;
        let placardsPlatformSaved = yield placardsPlatform.save();
        let placardsSite = new RightAdmin_1.RightAdmin();
        placardsSite.name = '分站公告';
        placardsSite.type = RightBase_1.RightType.Page;
        placardsSite.componentName = 'placardsSite';
        placardsSite.parent = placardsMenuSaved;
        let placardsSiteSaved = yield placardsSite.save();
        let siteMenu = new RightAdmin_1.RightAdmin();
        siteMenu.name = '分站管理';
        siteMenu.type = RightBase_1.RightType.MenuGroup;
        siteMenu.icon = 'el-icon-rank';
        siteMenu.parent = platformSaved;
        let siteMenuSaved = yield siteMenu.save();
        let addSite = new RightAdmin_1.RightAdmin();
        addSite.name = '新建分站';
        addSite.type = RightBase_1.RightType.Page;
        addSite.componentName = 'addSite';
        addSite.parent = siteMenuSaved;
        let addSiteSaved = yield addSite.save();
        let sites = new RightAdmin_1.RightAdmin();
        sites.name = '分站列表';
        sites.type = RightBase_1.RightType.Page;
        sites.componentName = 'sites';
        sites.parent = siteMenuSaved;
        let sitesSaved = yield sites.save();
        let feedbackMenu = new RightAdmin_1.RightAdmin();
        feedbackMenu.name = '问题反馈';
        feedbackMenu.type = RightBase_1.RightType.MenuGroup;
        feedbackMenu.icon = 'el-icon-question';
        feedbackMenu.parent = platformSaved;
        let feedbackMenuSaved = yield feedbackMenu.save();
        let feedbackSite = new RightAdmin_1.RightAdmin();
        feedbackSite.name = '站点反馈';
        feedbackSite.type = RightBase_1.RightType.Page;
        feedbackSite.componentName = 'feedbackSite';
        feedbackSite.parent = feedbackMenuSaved;
        let feedbackSiteSaved = yield feedbackSite.save();
        let feedbackUser = new RightAdmin_1.RightAdmin();
        feedbackUser.name = '用户反馈';
        feedbackUser.type = RightBase_1.RightType.Page;
        feedbackUser.componentName = 'feedbackUser';
        feedbackUser.parent = feedbackMenuSaved;
        let feedbackUserSaved = yield feedbackUser.save();
        let adminMenu = new RightAdmin_1.RightAdmin();
        adminMenu.name = '系统管理员';
        adminMenu.type = RightBase_1.RightType.MenuGroup;
        adminMenu.icon = 'el-icon-service';
        adminMenu.parent = platformSaved;
        let adminMenuSaved = yield adminMenu.save();
        let adminsRole = new RightAdmin_1.RightAdmin();
        adminsRole.name = '角色管理';
        adminsRole.type = RightBase_1.RightType.Page;
        adminsRole.componentName = 'adminsRole';
        adminsRole.parent = adminMenuSaved;
        let adminsRoleSaved = yield adminsRole.save();
        let adminsList = new RightAdmin_1.RightAdmin();
        adminsList.name = '管理员列表';
        adminsList.type = RightBase_1.RightType.Page;
        adminsList.componentName = 'adminsList';
        adminsList.parent = adminMenuSaved;
        let adminsListSaved = yield adminsList.save();
        let settingsMenu = new RightAdmin_1.RightAdmin();
        settingsMenu.name = '系统设置';
        settingsMenu.type = RightBase_1.RightType.MenuGroup;
        settingsMenu.icon = 'el-icon-setting';
        settingsMenu.parent = platformSaved;
        let settingsMenuSaved = yield settingsMenu.save();
        let right = new RightAdmin_1.RightAdmin();
        right.name = '权限管理';
        right.type = RightBase_1.RightType.Page;
        right.componentName = 'right';
        right.parent = settingsMenuSaved;
        let rightSaved = yield right.save();
        debug('插入权限数据成功！');
    }
}))();
//# sourceMappingURL=initDataBase.js.map
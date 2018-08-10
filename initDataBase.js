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
                    "id": "3d8aa286-2cbc-40e2-b7a1-0f9292953d21",
                    "type": "page",
                    "name": "平台管理",
                    "componentName": "home",
                    "icon": null,
                    "children": [{
                            "id": "00d74e8b-5af1-40c7-91ec-25b531bba368",
                            "type": "menu",
                            "name": "订单报错",
                            "componentName": "orderError",
                            "icon": "el-icon-document",
                            "children": [],
                            "saved": true
                        }, {
                            "id": "2e3ef633-8c7f-422e-998f-72f68a42cc4d",
                            "type": "page",
                            "name": "账户详情",
                            "componentName": "adminInfo",
                            "icon": null,
                            "children": [],
                            "saved": true
                        }, {
                            "id": "6de22feb-292d-4417-a6ce-f8fbc0736971",
                            "type": "page",
                            "name": "后台首页",
                            "componentName": "index",
                            "icon": null,
                            "children": [],
                            "saved": true
                        }, {
                            "id": "912dbf6f-683c-4707-ac68-8f74c40018c9",
                            "type": "menuGroup",
                            "name": "系统管理员",
                            "componentName": null,
                            "icon": "el-icon-service",
                            "children": [{
                                    "id": "9f837ff1-689f-4330-876a-31d08da56018",
                                    "type": "page",
                                    "name": "管理员列表",
                                    "componentName": "adminsList",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }, {
                                    "id": "eee251d8-7e36-4b8a-8c4b-f4aa9b224e03",
                                    "type": "page",
                                    "name": "角色管理",
                                    "componentName": "adminsRole",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }],
                            "saved": true
                        }, {
                            "id": "a08e71fb-f8d1-4ab5-bc76-dd3073d64ecf",
                            "type": "menuGroup",
                            "name": "商品管理",
                            "componentName": null,
                            "icon": "el-icon-goods",
                            "children": [{
                                    "id": "3e831724-d954-475e-af24-b2c423904c5a",
                                    "type": "page",
                                    "name": "所有商品",
                                    "componentName": "productAll",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }, {
                                    "id": "fbfdfc40-4cf4-4782-82ab-c889894ab862",
                                    "type": "page",
                                    "name": "分类列表",
                                    "componentName": "productTypes",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }],
                            "saved": true
                        }, {
                            "id": "de3f6eb6-c599-4f4a-9178-172fc1e1b620",
                            "type": "menuGroup",
                            "name": "分站管理",
                            "componentName": null,
                            "icon": "el-icon-rank",
                            "children": [{
                                    "id": "3c050140-dca8-47e0-9e4f-b0b1cf64ca0a",
                                    "type": "page",
                                    "name": "新建分站",
                                    "componentName": "addSite",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }, {
                                    "id": "901a1e8c-dc8f-4113-9d24-0b335365f5bb",
                                    "type": "page",
                                    "name": "分站列表",
                                    "componentName": "sites",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }],
                            "saved": true
                        }, {
                            "id": "e40ada35-b214-459a-9e7f-a78c57e7bb80",
                            "type": "menuGroup",
                            "name": "资金管理",
                            "componentName": null,
                            "icon": "el-icon-star-on",
                            "children": [{
                                    "id": "1ad77087-b379-4315-b0e2-2f93c8686767",
                                    "type": "page",
                                    "name": "充值记录",
                                    "componentName": "recharge",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }, {
                                    "id": "e1d2922a-80d6-4653-9621-dfcf1d56b82e",
                                    "type": "page",
                                    "name": "提现记录",
                                    "componentName": "withdraw",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }],
                            "saved": true
                        }, {
                            "id": "ed599794-e1d5-4731-bb39-5644b056fede",
                            "type": "menuGroup",
                            "name": "公告管理",
                            "componentName": null,
                            "icon": "el-icon-message",
                            "children": [{
                                    "id": "792b82bd-ac6d-423f-a9f5-48e9ed8a2305",
                                    "type": "page",
                                    "name": "平台公告",
                                    "componentName": "placardsPlatform",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }, {
                                    "id": "95a9c266-2f87-49a2-b61e-c994fb4dddf1",
                                    "type": "page",
                                    "name": "分站公告",
                                    "componentName": "placardsSite",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }],
                            "saved": true
                        }, {
                            "id": "ef73c0e4-08cf-4d00-bf97-1852b5195e19",
                            "type": "menuGroup",
                            "name": "问题反馈",
                            "componentName": null,
                            "icon": "el-icon-question",
                            "children": [{
                                    "id": "52ac8499-7901-4d80-b6bb-9fe7903c5a68",
                                    "type": "page",
                                    "name": "站点反馈",
                                    "componentName": "feedbackSite",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }, {
                                    "id": "f08d9bce-c60d-42be-8d83-360127cc074a",
                                    "type": "page",
                                    "name": "用户反馈",
                                    "componentName": "feedbackUser",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }],
                            "saved": true
                        }, {
                            "id": "f8cc8fff-4d59-41ba-805d-6952ae0d432a",
                            "type": "menuGroup",
                            "name": "系统设置",
                            "componentName": null,
                            "icon": "el-icon-setting",
                            "children": [{
                                    "id": "554d7180-6cb1-46e4-bcf8-4455f309d478",
                                    "type": "page",
                                    "name": "权限管理",
                                    "componentName": "right",
                                    "icon": null,
                                    "children": [],
                                    "saved": true
                                }],
                            "saved": true
                        }],
                    "saved": true
                }], [{
                    "id": "00d74e8b-5af1-40c7-91ec-25b531bba368",
                    "type": "menu",
                    "name": "订单报错",
                    "componentName": "orderError",
                    "icon": "el-icon-document",
                    "children": []
                }, {
                    "id": "2e3ef633-8c7f-422e-998f-72f68a42cc4d",
                    "type": "page",
                    "name": "账户详情",
                    "componentName": "adminInfo",
                    "icon": null,
                    "children": []
                }, {
                    "id": "6de22feb-292d-4417-a6ce-f8fbc0736971",
                    "type": "page",
                    "name": "后台首页",
                    "componentName": "index",
                    "icon": null,
                    "children": []
                }, {
                    "id": "9f837ff1-689f-4330-876a-31d08da56018",
                    "type": "page",
                    "name": "管理员列表",
                    "componentName": "adminsList",
                    "icon": null,
                    "children": []
                }, {
                    "id": "eee251d8-7e36-4b8a-8c4b-f4aa9b224e03",
                    "type": "page",
                    "name": "角色管理",
                    "componentName": "adminsRole",
                    "icon": null,
                    "children": []
                }, {
                    "id": "3e831724-d954-475e-af24-b2c423904c5a",
                    "type": "page",
                    "name": "所有商品",
                    "componentName": "productAll",
                    "icon": null,
                    "children": []
                }, {
                    "id": "fbfdfc40-4cf4-4782-82ab-c889894ab862",
                    "type": "page",
                    "name": "分类列表",
                    "componentName": "productTypes",
                    "icon": null,
                    "children": []
                }, {
                    "id": "3c050140-dca8-47e0-9e4f-b0b1cf64ca0a",
                    "type": "page",
                    "name": "新建分站",
                    "componentName": "addSite",
                    "icon": null,
                    "children": []
                }, {
                    "id": "901a1e8c-dc8f-4113-9d24-0b335365f5bb",
                    "type": "page",
                    "name": "分站列表",
                    "componentName": "sites",
                    "icon": null,
                    "children": []
                }, {
                    "id": "1ad77087-b379-4315-b0e2-2f93c8686767",
                    "type": "page",
                    "name": "充值记录",
                    "componentName": "recharge",
                    "icon": null,
                    "children": []
                }, {
                    "id": "e1d2922a-80d6-4653-9621-dfcf1d56b82e",
                    "type": "page",
                    "name": "提现记录",
                    "componentName": "withdraw",
                    "icon": null,
                    "children": []
                }, {
                    "id": "792b82bd-ac6d-423f-a9f5-48e9ed8a2305",
                    "type": "page",
                    "name": "平台公告",
                    "componentName": "placardsPlatform",
                    "icon": null,
                    "children": []
                }, {
                    "id": "95a9c266-2f87-49a2-b61e-c994fb4dddf1",
                    "type": "page",
                    "name": "分站公告",
                    "componentName": "placardsSite",
                    "icon": null,
                    "children": []
                }, {
                    "id": "52ac8499-7901-4d80-b6bb-9fe7903c5a68",
                    "type": "page",
                    "name": "站点反馈",
                    "componentName": "feedbackSite",
                    "icon": null,
                    "children": []
                }, {
                    "id": "f08d9bce-c60d-42be-8d83-360127cc074a",
                    "type": "page",
                    "name": "用户反馈",
                    "componentName": "feedbackUser",
                    "icon": null,
                    "children": []
                }, {
                    "id": "554d7180-6cb1-46e4-bcf8-4455f309d478",
                    "type": "page",
                    "name": "权限管理",
                    "componentName": "right",
                    "icon": null,
                    "children": []
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
        orderError.type = RightBase_1.RightType.Menu;
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
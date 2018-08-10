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
        orderError.type = RightType.Menu;
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



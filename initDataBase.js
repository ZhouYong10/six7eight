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
    let roleUserAdmin = yield RoleUserAdmin_1.RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin_1.RoleUserAdmin();
        roleUserAdmin.name = '开发者';
        roleUserAdmin.rights = [yield RightAdmin_1.RightAdmin.findTrees(), yield RightAdmin_1.RightAdmin.getAllLeaf()];
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
}))();
//# sourceMappingURL=initDataBase.js.map
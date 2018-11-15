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
const RightUser_1 = require("./entity/RightUser");
const RightSite_1 = require("./entity/RightSite");
const debug = debuger('six7eight:initDataBase');
(() => __awaiter(this, void 0, void 0, function* () {
    let rightAdminTree = yield RightAdmin_1.RightAdmin.findTrees();
    if (rightAdminTree.length < 1) {
        let platform = new RightAdmin_1.RightAdmin();
        platform.name = '平台权限';
        platform.type = RightBase_1.RightType.Page;
        platform.componentName = 'home';
        let platformSaved = yield platform.save();
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
        let productField = new RightAdmin_1.RightAdmin();
        productField.name = '商品字段';
        productField.type = RightBase_1.RightType.Page;
        productField.componentName = 'productFields';
        productField.parent = productMenuSaved;
        let productFieldSaved = yield productField.save();
        let productTypes = new RightAdmin_1.RightAdmin();
        productTypes.name = '商品类别';
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
        siteMenu.type = RightBase_1.RightType.Menu;
        siteMenu.icon = 'el-icon-rank';
        siteMenu.componentName = 'sites';
        siteMenu.parent = platformSaved;
        let siteMenuSaved = yield siteMenu.save();
        let users = new RightAdmin_1.RightAdmin();
        users.name = '用户管理';
        users.type = RightBase_1.RightType.Menu;
        users.icon = 'el-icon-rank';
        users.componentName = 'users';
        users.parent = platformSaved;
        let usersSaved = yield users.save();
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
        adminsRole.name = '管理员角色';
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
        let rightAdmin = new RightAdmin_1.RightAdmin();
        rightAdmin.name = '平台权限';
        rightAdmin.type = RightBase_1.RightType.Page;
        rightAdmin.componentName = 'right';
        rightAdmin.parent = settingsMenuSaved;
        let rightSaved = yield rightAdmin.save();
        let rightSite = new RightAdmin_1.RightAdmin();
        rightSite.name = '分站权限';
        rightSite.type = RightBase_1.RightType.Page;
        rightSite.componentName = 'siteRight';
        rightSite.parent = settingsMenuSaved;
        let rightSiteSaved = yield rightSite.save();
        let rightUser = new RightAdmin_1.RightAdmin();
        rightUser.name = '用户权限';
        rightUser.type = RightBase_1.RightType.Page;
        rightUser.componentName = 'userRight';
        rightUser.parent = settingsMenuSaved;
        let rightUserSaved = yield rightUser.save();
        debug('插入平台权限数据成功！');
    }
    let rightSiteTree = yield RightSite_1.RightSite.findTrees();
    if (rightSiteTree.length < 1) {
        let site = new RightSite_1.RightSite();
        site.name = '分站权限';
        site.type = RightBase_1.RightType.Page;
        let siteSaved = yield site.save();
        let fundsManage = new RightSite_1.RightSite();
        fundsManage.name = '资金管理';
        fundsManage.type = RightBase_1.RightType.MenuGroup;
        fundsManage.icon = 'el-icon-star-on';
        fundsManage.parent = siteSaved;
        let fundsManageSaved = yield fundsManage.save();
        let recharge = new RightSite_1.RightSite();
        recharge.name = '在线充值';
        recharge.type = RightBase_1.RightType.Page;
        recharge.componentName = 'recharge';
        recharge.parent = fundsManageSaved;
        let rechargeSaved = yield recharge.save();
        let rechargeRecord = new RightSite_1.RightSite();
        rechargeRecord.name = '充值记录';
        rechargeRecord.type = RightBase_1.RightType.Page;
        rechargeRecord.componentName = 'rechargeRecord';
        rechargeRecord.parent = fundsManageSaved;
        let rechargeRecordSaved = yield rechargeRecord.save();
        let consumeRecord = new RightSite_1.RightSite();
        consumeRecord.name = '消费记录';
        consumeRecord.type = RightBase_1.RightType.Page;
        consumeRecord.componentName = 'consumeRecord';
        consumeRecord.parent = fundsManageSaved;
        let consumeRecordSaved = yield consumeRecord.save();
        let profitRecord = new RightSite_1.RightSite();
        profitRecord.name = '返利记录';
        profitRecord.type = RightBase_1.RightType.Page;
        profitRecord.componentName = 'profitRecord';
        profitRecord.parent = fundsManageSaved;
        let profitRecordSaved = yield profitRecord.save();
        let withdraw = new RightSite_1.RightSite();
        withdraw.name = '申请提现';
        withdraw.type = RightBase_1.RightType.Page;
        withdraw.componentName = 'withdraw';
        withdraw.parent = fundsManageSaved;
        let withdrawSaved = yield withdraw.save();
        let withdrawRecord = new RightSite_1.RightSite();
        withdrawRecord.name = '提现记录';
        withdrawRecord.type = RightBase_1.RightType.Page;
        withdrawRecord.componentName = 'withdrawRecord';
        withdrawRecord.parent = fundsManageSaved;
        let withdrawRecordSaved = yield withdrawRecord.save();
        let productMenu = new RightSite_1.RightSite();
        productMenu.name = '商品管理';
        productMenu.type = RightBase_1.RightType.MenuGroup;
        productMenu.icon = 'el-icon-goods';
        productMenu.parent = siteSaved;
        let productMenuSaved = yield productMenu.save();
        let productType = new RightSite_1.RightSite();
        productType.name = '商品类别';
        productType.type = RightBase_1.RightType.Page;
        productType.componentName = 'productType';
        productType.parent = productMenuSaved;
        let productTypeSaved = yield productType.save();
        let product = new RightSite_1.RightSite();
        product.name = '所有商品';
        product.type = RightBase_1.RightType.Page;
        product.componentName = 'product';
        product.parent = productMenuSaved;
        let productSaved = yield product.save();
        let adminManage = new RightSite_1.RightSite();
        adminManage.name = '站点管理员';
        adminManage.type = RightBase_1.RightType.MenuGroup;
        adminManage.icon = 'el-icon-service';
        adminManage.parent = siteSaved;
        let adminManageSaved = yield adminManage.save();
        let adminRole = new RightSite_1.RightSite();
        adminRole.name = '管理员角色';
        adminRole.type = RightBase_1.RightType.Page;
        adminRole.componentName = 'adminRole';
        adminRole.parent = adminManageSaved;
        let adminRoleSaved = yield adminRole.save();
        let admins = new RightSite_1.RightSite();
        admins.name = '管理员列表';
        admins.type = RightBase_1.RightType.Page;
        admins.componentName = 'admins';
        admins.parent = adminManageSaved;
        let adminsSaved = yield admins.save();
        let feedbackManage = new RightSite_1.RightSite();
        feedbackManage.name = '问题反馈';
        feedbackManage.type = RightBase_1.RightType.MenuGroup;
        feedbackManage.icon = 'el-icon-question';
        feedbackManage.parent = siteSaved;
        let feedbackManageSaved = yield feedbackManage.save();
        let feedback = new RightSite_1.RightSite();
        feedback.name = '我的反馈';
        feedback.type = RightBase_1.RightType.Page;
        feedback.componentName = 'feedback';
        feedback.parent = feedbackManageSaved;
        let feedbackSaved = yield feedback.save();
        let userFeedback = new RightSite_1.RightSite();
        userFeedback.name = '用户反馈';
        userFeedback.type = RightBase_1.RightType.Page;
        userFeedback.componentName = 'userFeedback';
        userFeedback.parent = feedbackManageSaved;
        let userFeedbackSaved = yield userFeedback.save();
        let placard = new RightSite_1.RightSite();
        placard.name = '公告管理';
        placard.type = RightBase_1.RightType.Menu;
        placard.componentName = 'placard';
        placard.icon = 'el-icon-message';
        placard.parent = siteSaved;
        let placardSaved = yield placard.save();
        let settings = new RightSite_1.RightSite();
        settings.name = '站点设置';
        settings.type = RightBase_1.RightType.Menu;
        settings.componentName = 'settings';
        settings.icon = 'el-icon-setting';
        settings.parent = siteSaved;
        let settingsSaved = yield settings.save();
        debug('插入分站权限数据成功！');
    }
    let rightUserTree = yield RightUser_1.RightUser.findTrees();
    if (rightUserTree.length < 1) {
        let user = new RightUser_1.RightUser();
        user.name = '用户权限';
        user.type = RightBase_1.RightType.Page;
        let userSaved = yield user.save();
        let fundsManage = new RightUser_1.RightUser();
        fundsManage.name = '资金管理';
        fundsManage.type = RightBase_1.RightType.MenuGroup;
        fundsManage.icon = 'el-icon-star-on';
        fundsManage.parent = userSaved;
        let fundsManageSaved = yield fundsManage.save();
        let recharge = new RightUser_1.RightUser();
        recharge.name = '在线充值';
        recharge.type = RightBase_1.RightType.Page;
        recharge.componentName = 'recharge';
        recharge.parent = fundsManageSaved;
        let rechargeSaved = yield recharge.save();
        let rechargeRecord = new RightUser_1.RightUser();
        rechargeRecord.name = '充值记录';
        rechargeRecord.type = RightBase_1.RightType.Page;
        rechargeRecord.componentName = 'rechargeRecord';
        rechargeRecord.parent = fundsManageSaved;
        let rechargeRecordSaved = yield rechargeRecord.save();
        let consumeRecord = new RightUser_1.RightUser();
        consumeRecord.name = '消费记录';
        consumeRecord.type = RightBase_1.RightType.Page;
        consumeRecord.componentName = 'consumeRecord';
        consumeRecord.parent = fundsManageSaved;
        let consumeRecordSaved = yield consumeRecord.save();
        let profitRecord = new RightUser_1.RightUser();
        profitRecord.name = '返利记录';
        profitRecord.type = RightBase_1.RightType.Page;
        profitRecord.componentName = 'profitRecord';
        profitRecord.parent = fundsManageSaved;
        let profitRecordSaved = yield profitRecord.save();
        let withdraw = new RightUser_1.RightUser();
        withdraw.name = '申请提现';
        withdraw.type = RightBase_1.RightType.Page;
        withdraw.componentName = 'withdraw';
        withdraw.parent = fundsManageSaved;
        let withdrawSaved = yield withdraw.save();
        let withdrawRecord = new RightUser_1.RightUser();
        withdrawRecord.name = '提现记录';
        withdrawRecord.type = RightBase_1.RightType.Page;
        withdrawRecord.componentName = 'withdrawRecord';
        withdrawRecord.parent = fundsManageSaved;
        let withdrawRecordSaved = yield withdrawRecord.save();
        let lowerUsers = new RightUser_1.RightUser();
        lowerUsers.name = '我的下级';
        lowerUsers.type = RightBase_1.RightType.Menu;
        lowerUsers.componentName = 'lowerUsers';
        lowerUsers.icon = 'el-icon-share';
        lowerUsers.parent = userSaved;
        let lowerUsersSaved = yield lowerUsers.save();
        let feedback = new RightUser_1.RightUser();
        feedback.name = '问题反馈';
        feedback.type = RightBase_1.RightType.Menu;
        feedback.componentName = 'feedback';
        feedback.icon = 'el-icon-question';
        feedback.parent = userSaved;
        let feedbackSaved = yield feedback.save();
        debug('插入用户权限数据成功！');
    }
    let roleUserAdmin = yield RoleUserAdmin_1.RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin_1.RoleUserAdmin();
        roleUserAdmin.type = RoleUserAdmin_1.RoleUserAdminType.Developer;
        roleUserAdmin.name = '开发者';
        roleUserAdmin.rights = [yield RightAdmin_1.RightAdmin.findTrees(), yield RightAdmin_1.RightAdmin.getAllLeaf()];
        let roleUserAdminSaved = yield roleUserAdmin.save();
        debug('插入开发者角色数据库成功！！');
    }
    let userAdmin = yield UserAdmin_1.UserAdmin.findByName('admin');
    if (!userAdmin) {
        userAdmin = new UserAdmin_1.UserAdmin();
        userAdmin.username = 'admin';
        userAdmin.password = 'admin';
        userAdmin.qq = '';
        userAdmin.phone = '';
        userAdmin.weixin = '';
        userAdmin.email = '';
        userAdmin.role = roleUserAdmin;
        let userAdminSaved = yield userAdmin.save();
        debug('插入admin账户数据库成功！！');
    }
}))();
//# sourceMappingURL=initDataBase.js.map
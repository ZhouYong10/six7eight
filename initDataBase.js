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
const CRightAdmin_1 = require("./controler/CRightAdmin");
const CRightSite_1 = require("./controler/CRightSite");
const CRightUser_1 = require("./controler/CRightUser");
const Platform_1 = require("./entity/Platform");
const CProductTypes_1 = require("./controler/CProductTypes");
const utils_1 = require("./utils");
const debug = debuger('six7eight:initDataBase');
(() => __awaiter(this, void 0, void 0, function* () {
    let rightAdminTree = yield CRightAdmin_1.CRightAdmin.show();
    if (rightAdminTree.length < 1) {
        let orderError = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '订单报错',
            icon: 'el-icon-document',
            path: '/home/order/error',
            fingerprint: 'orderErrorPlatform',
            parentId: null
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showOrderErrorPlatform',
            parentId: orderError.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealOrderErrorPlatform',
            parentId: orderError.id
        });
        let fundsManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuGroup',
            name: '资金管理',
            icon: 'el-icon-star-on',
            path: '',
            fingerprint: 'fundsManagePlatform',
            parentId: null
        });
        let recharge = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '充值记录',
            icon: 'el-icon-tickets',
            path: '/home/funds/manage/recharges',
            fingerprint: 'rechargesPlatform',
            parentId: fundsManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRechargePlatform',
            parentId: recharge.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '充值',
            icon: '',
            path: '',
            fingerprint: 'rechargeSuccessPlatform',
            parentId: recharge.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '失败',
            icon: '',
            path: '',
            fingerprint: 'rechargeFailPlatform',
            parentId: recharge.id
        });
        let withdraw = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '提现记录',
            icon: 'el-icon-tickets',
            path: '/home/funds/manage/withdraws',
            fingerprint: 'withdrawsPlatform',
            parentId: fundsManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showWithdrawPlatform',
            parentId: withdraw.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '成功',
            icon: '',
            path: '',
            fingerprint: 'withdrawSuccessPlatform',
            parentId: withdraw.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '失败',
            icon: '',
            path: '',
            fingerprint: 'withdrawFailPlatform',
            parentId: withdraw.id
        });
        let productManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuGroup',
            name: '商品管理',
            icon: 'el-icon-goods',
            path: '',
            fingerprint: 'productManagePlatform',
            parentId: null
        });
        let productField = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '商品字段',
            icon: 'el-icon-tickets',
            path: '/home/product/field/manage',
            fingerprint: 'productFieldPlatform',
            parentId: productManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductFieldPlatform',
            parentId: productField.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductFieldPlatform',
            parentId: productField.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductFieldPlatform',
            parentId: productField.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deleteProductFieldPlatform',
            parentId: productField.id
        });
        let productType = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '商品类别',
            icon: 'el-icon-tickets',
            path: '/home/product/type/manage',
            fingerprint: 'productTypePlatform',
            parentId: productManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductTypePlatform',
            parentId: productType.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductTypePlatform',
            parentId: productType.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductTypePlatform',
            parentId: productType.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductTypePlatform',
            parentId: productType.id
        });
        let productAll = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '所有商品',
            icon: 'el-icon-tickets',
            path: '/home/product/all/manage',
            fingerprint: 'productAllPlatform',
            parentId: productManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductPlatform',
            parentId: productAll.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductPlatform',
            parentId: productAll.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductPlatform',
            parentId: productAll.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductPlatform',
            parentId: productAll.id
        });
        let placardManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuGroup',
            name: '公告管理',
            icon: 'el-icon-message',
            path: '',
            fingerprint: 'placardManagePlatform',
            parentId: null
        });
        let placardPlatform = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '平台公告',
            icon: 'el-icon-tickets',
            path: '/home/placard/platform/manage',
            fingerprint: 'placardPlatform',
            parentId: placardManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showPlacardPlatform',
            parentId: placardPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addPlacardPlatform',
            parentId: placardPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editPlacardPlatform',
            parentId: placardPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deletePlacardPlatform',
            parentId: placardPlatform.id
        });
        let placardSite = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '分站公告',
            icon: 'el-icon-tickets',
            path: '/home/placard/site/manage',
            fingerprint: 'placardSitePlatform',
            parentId: placardManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showPlacardSitePlatform',
            parentId: placardSite.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deletePlacardSitePlatform',
            parentId: placardSite.id
        });
        let siteManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '分站管理',
            icon: 'el-icon-rank',
            path: '/home/site/manage',
            fingerprint: 'siteManagePlatform',
            parentId: null
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showSitePlatform',
            parentId: siteManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addSitePlatform',
            parentId: siteManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '修改状态',
            icon: '',
            path: '',
            fingerprint: 'changeSiteStatePlatform',
            parentId: siteManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '修改金额',
            icon: '',
            path: '',
            fingerprint: 'changeSiteFundsPlatform',
            parentId: siteManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editSitePlatform',
            parentId: siteManage.id
        });
        let userManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '用户管理',
            icon: 'el-icon-rank',
            path: '/home/user/manage',
            fingerprint: 'userManagePlatform',
            parentId: null
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showUserManagePlatform',
            parentId: userManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '修改状态',
            icon: '',
            path: '',
            fingerprint: 'changeUserStatePlatform',
            parentId: userManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '修改金额',
            icon: '',
            path: '',
            fingerprint: 'changeUserFundsPlatform',
            parentId: userManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '备注',
            icon: '',
            path: '',
            fingerprint: 'remarkUserPlatform',
            parentId: userManage.id
        });
        let feedbackManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuGroup',
            name: '问题反馈',
            icon: 'el-icon-question',
            path: '',
            fingerprint: 'feedbackManagePlatform',
            parentId: null
        });
        let feedbackSite = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '站点反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/site/manage',
            fingerprint: 'feedbackSitePlatform',
            parentId: feedbackManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackSitePlatform',
            parentId: feedbackSite.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealFeedbackSitePlatform',
            parentId: feedbackSite.id
        });
        let feedbackUser = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '用户反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/user/manage',
            fingerprint: 'feedbackUserPlatform',
            parentId: feedbackManage.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackUserPlatform',
            parentId: feedbackUser.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealFeedbackUserPlatform',
            parentId: feedbackUser.id
        });
        let adminManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuGroup',
            name: '系统管理员',
            icon: 'el-icon-service',
            path: '',
            fingerprint: 'adminManagePlatform',
            parentId: null
        });
        let adminRole = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '管理员角色',
            icon: 'el-icon-tickets',
            path: '/home/admin/role/manage',
            fingerprint: 'adminRolePlatform',
            parentId: adminManage.id
        });
        let adminList = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '管理员列表',
            icon: 'el-icon-tickets',
            path: '/home/admin/list/manage',
            fingerprint: 'adminListPlatform',
            parentId: adminManage.id
        });
        let settings = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuGroup',
            name: '系统设置',
            icon: 'el-icon-setting',
            path: '',
            fingerprint: 'settingsPlatform',
            parentId: null
        });
        let infoPlatform = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '平台信息',
            icon: 'el-icon-tickets',
            path: '/home/info/platform/manage',
            fingerprint: 'infoPlatform',
            parentId: settings.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showInfoPlatform',
            parentId: infoPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editInfoPlatform',
            parentId: infoPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示成本利润',
            icon: '',
            path: '',
            fingerprint: 'showBasePriceProfitPlatform',
            parentId: infoPlatform.id
        });
        let rightPlatform = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '平台权限',
            icon: 'el-icon-tickets',
            path: '/home/right/platform/manage',
            fingerprint: 'rightManagePlatform',
            parentId: settings.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRightManagePlatform',
            parentId: rightPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单组',
            icon: '',
            path: '',
            fingerprint: 'addMenuGroupRightPlatform',
            parentId: rightPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单项',
            icon: '',
            path: '',
            fingerprint: 'addMenuRightPlatform',
            parentId: rightPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '权限树添加',
            icon: '',
            path: '',
            fingerprint: 'addTreeRightPlatform',
            parentId: rightPlatform.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '权限树编辑',
            icon: '',
            path: '',
            fingerprint: 'editTreeRightPlatform',
            parentId: rightPlatform.id
        });
        let rightSite = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '分站权限',
            icon: 'el-icon-tickets',
            path: '/home/right/site/manage',
            fingerprint: 'rightManageSite',
            parentId: settings.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRightManageSite',
            parentId: rightSite.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单组',
            icon: '',
            path: '',
            fingerprint: 'addMenuGroupRightSite',
            parentId: rightSite.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单项',
            icon: '',
            path: '',
            fingerprint: 'addMenuRightSite',
            parentId: rightSite.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '权限树添加',
            icon: '',
            path: '',
            fingerprint: 'addTreeRightSite',
            parentId: rightSite.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '权限树编辑',
            icon: '',
            path: '',
            fingerprint: 'editTreeRightSite',
            parentId: rightSite.id
        });
        let rightUser = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '用户权限',
            icon: 'el-icon-tickets',
            path: '/home/right/user/manage',
            fingerprint: 'rightManageUser',
            parentId: settings.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRightManageUser',
            parentId: rightUser.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单组',
            icon: '',
            path: '',
            fingerprint: 'addMenuGroupRightUser',
            parentId: rightUser.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单项',
            icon: '',
            path: '',
            fingerprint: 'addMenuRightUser',
            parentId: rightUser.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '权限树添加',
            icon: '',
            path: '',
            fingerprint: 'addTreeRightUser',
            parentId: rightUser.id
        });
        yield CRightAdmin_1.CRightAdmin.add({
            type: 'menuItem',
            name: '权限树编辑',
            icon: '',
            path: '',
            fingerprint: 'editTreeRightUser',
            parentId: rightUser.id
        });
        debug('插入平台权限数据成功！');
    }
    let rightSiteTree = yield CRightSite_1.CRightSite.show();
    if (rightSiteTree.length < 1) {
        let orderError = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '订单报错',
            icon: 'el-icon-document',
            path: '/home/order/error/manage',
            fingerprint: 'orderErrorSite',
            parentId: null
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showOrderErrorSite',
            parentId: orderError.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealOrderErrorSite',
            parentId: orderError.id
        });
        let fundsManage = yield CRightSite_1.CRightSite.add({
            type: 'menuGroup',
            name: '资金管理',
            icon: 'el-icon-star-on',
            path: '',
            fingerprint: 'fundsManageSite',
            parentId: null
        });
        let recharge = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '在线充值',
            icon: 'el-icon-tickets',
            path: '/home/recharge/records',
            fingerprint: 'rechargeSite',
            parentId: fundsManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRechargeSite',
            parentId: recharge.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '充值',
            icon: '',
            path: '',
            fingerprint: 'addRechargeSite',
            parentId: recharge.id
        });
        let consume = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '消费记录',
            icon: 'el-icon-tickets',
            path: '/home/consume/records',
            fingerprint: 'consumeSite',
            parentId: fundsManage.id
        });
        let profit = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '返利记录',
            icon: 'el-icon-tickets',
            path: '/home/profit/records',
            fingerprint: 'profitSite',
            parentId: fundsManage.id
        });
        let withdraw = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '申请提现',
            icon: 'el-icon-tickets',
            path: '/home/withdraw/records',
            fingerprint: 'withdrawSite',
            parentId: fundsManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showWithdrawSite',
            parentId: withdraw.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '提现',
            icon: '',
            path: '',
            fingerprint: 'addWithdrawSite',
            parentId: withdraw.id
        });
        let productManage = yield CRightSite_1.CRightSite.add({
            type: 'menuGroup',
            name: '商品管理',
            icon: 'el-icon-goods',
            path: '',
            fingerprint: 'productManageSite',
            parentId: null
        });
        let productType = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '商品类别',
            icon: 'el-icon-tickets',
            path: '/home/product/type/manage',
            fingerprint: 'productTypeSite',
            parentId: productManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductTypeSite',
            parentId: productType.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductTypeSite',
            parentId: productType.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductTypeSite',
            parentId: productType.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductTypeSite',
            parentId: productType.id
        });
        let productAll = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '所有商品',
            icon: 'el-icon-tickets',
            path: '/home/product/all/manage',
            fingerprint: 'productAllSite',
            parentId: productManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductAllSite',
            parentId: productAll.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductAllSite',
            parentId: productAll.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '批量加价',
            icon: '',
            path: '',
            fingerprint: 'batchEditProductAllSite',
            parentId: productAll.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductAllSite',
            parentId: productAll.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductAllSite',
            parentId: productAll.id
        });
        let adminManage = yield CRightSite_1.CRightSite.add({
            type: 'menuGroup',
            name: '站点管理员',
            icon: 'el-icon-service',
            path: '',
            fingerprint: 'adminManageSite',
            parentId: null
        });
        let adminRole = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '管理员角色',
            icon: 'el-icon-tickets',
            path: '/home/admin/role/manage',
            fingerprint: 'adminRoleSite',
            parentId: adminManage.id
        });
        let adminList = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '管理员列表',
            icon: 'el-icon-tickets',
            path: '/home/admin/list/manage',
            fingerprint: 'adminListSite',
            parentId: adminManage.id
        });
        let userManage = yield CRightSite_1.CRightSite.add({
            type: 'menuGroup',
            name: '用户管理',
            icon: 'el-icon-rank',
            path: '',
            fingerprint: 'userManageSite',
            parentId: null
        });
        let userRole = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '用户角色',
            icon: 'el-icon-tickets',
            path: '/home/user/role/manage',
            fingerprint: 'userRoleSite',
            parentId: userManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showUserRoleSite',
            parentId: userRole.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editUserRoleSite',
            parentId: userRole.id
        });
        let userList = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '用户列表',
            icon: 'el-icon-tickets',
            path: '/home/user/list/manage',
            fingerprint: 'userListSite',
            parentId: userManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showUserListSite',
            parentId: userList.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addUserListSite',
            parentId: userList.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '修改状态',
            icon: '',
            path: '',
            fingerprint: 'changeStateUserListSite',
            parentId: userList.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '备注',
            icon: '',
            path: '',
            fingerprint: 'remarkUserListSite',
            parentId: userList.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editUserListSite',
            parentId: userList.id
        });
        let feedbackManage = yield CRightSite_1.CRightSite.add({
            type: 'menuGroup',
            name: '问题反馈',
            icon: 'el-icon-question',
            path: '',
            fingerprint: 'feedbackManageSite',
            parentId: null
        });
        let feedbackSite = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '我的反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/mine/manage',
            fingerprint: 'feedbackSite',
            parentId: feedbackManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackSite',
            parentId: feedbackSite.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addFeedbackSite',
            parentId: feedbackSite.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editFeedbackSite',
            parentId: feedbackSite.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deleteFeedbackSite',
            parentId: feedbackSite.id
        });
        let feedbackUser = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '用户反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/user/manage',
            fingerprint: 'feedbackUserSite',
            parentId: feedbackManage.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackUserSite',
            parentId: feedbackUser.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealFeedbackUserSite',
            parentId: feedbackUser.id
        });
        let placard = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '公告管理',
            icon: 'el-icon-message',
            path: '/home/placard/manage',
            fingerprint: 'placardSite',
            parentId: null
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showPlacardSite',
            parentId: placard.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addPlacardSite',
            parentId: placard.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editPlacardSite',
            parentId: placard.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'dealPlacardSite',
            parentId: placard.id
        });
        let settings = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '站点设置',
            icon: 'el-icon-setting',
            path: '/home/site/settings',
            fingerprint: 'settingsSite',
            parentId: null
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showSettingsSite',
            parentId: settings.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editSettingsSite',
            parentId: settings.id
        });
        yield CRightSite_1.CRightSite.add({
            type: 'menuItem',
            name: '显示金额',
            icon: '',
            path: '',
            fingerprint: 'showFundsSite',
            parentId: settings.id
        });
        debug('插入分站权限数据成功！');
    }
    let rightUserTree = yield CRightUser_1.CRightUser.show();
    if (rightUserTree.length < 1) {
        let fundsManage = yield CRightUser_1.CRightUser.add({
            type: 'menuGroup',
            name: '资金管理',
            icon: 'el-icon-star-on',
            path: '',
            fingerprint: 'fundsManageUser',
            parentId: null
        });
        let recharge = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '在线充值',
            icon: 'el-icon-tickets',
            path: '/recharge/records',
            fingerprint: 'rechargeUser',
            parentId: fundsManage.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRechargeUser',
            parentId: recharge.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '充值',
            icon: '',
            path: '',
            fingerprint: 'addRechargeUser',
            parentId: recharge.id
        });
        let consume = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '消费记录',
            icon: 'el-icon-tickets',
            path: '/consume/records',
            fingerprint: 'consumeUser',
            parentId: fundsManage.id
        });
        let profit = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '返利记录',
            icon: 'el-icon-tickets',
            path: '/profit/records',
            fingerprint: 'profitUser',
            parentId: fundsManage.id
        });
        let withdraw = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '申请提现',
            icon: 'el-icon-tickets',
            path: '/withdraw/records',
            fingerprint: 'withdrawUser',
            parentId: fundsManage.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showWithdrawUser',
            parentId: withdraw.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '提现',
            icon: '',
            path: '',
            fingerprint: 'addWithdrawUser',
            parentId: withdraw.id
        });
        let roleUp = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '代理升级',
            icon: 'el-icon-upload2',
            path: '/user/role/up',
            fingerprint: 'roleUpUser',
            parentId: null
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRoleUpUser',
            parentId: roleUp.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '升级',
            icon: '',
            path: '',
            fingerprint: 'canRoleUpUser',
            parentId: roleUp.id
        });
        let lowerUser = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '我的下级',
            icon: 'el-icon-share',
            path: '/lower/user',
            fingerprint: 'lowerUser',
            parentId: null
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showLowerUser',
            parentId: lowerUser.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addLowerUser',
            parentId: lowerUser.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editLowerUser',
            parentId: lowerUser.id
        });
        let feedback = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '问题反馈',
            icon: 'el-icon-question',
            path: '/feedback/records',
            fingerprint: 'feedbackUser',
            parentId: null
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackUser',
            parentId: feedback.id
        });
        yield CRightUser_1.CRightUser.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addFeedbackUser',
            parentId: feedback.id
        });
        debug('插入用户权限数据成功！');
    }
    let roleUserAdmin = yield RoleUserAdmin_1.RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        let adminRights = yield RightAdmin_1.RightAdmin.getAllPermissions();
        roleUserAdmin = new RoleUserAdmin_1.RoleUserAdmin();
        roleUserAdmin.type = RoleUserAdmin_1.RoleUserAdminType.Developer;
        roleUserAdmin.name = '开发者';
        roleUserAdmin.editRights = adminRights;
        roleUserAdmin.rights = adminRights;
        let productMenus = yield CProductTypes_1.CProductTypes.productsRight();
        let { productTypes, products } = utils_1.getMyProducts(roleUserAdmin.treeRights(productMenus));
        roleUserAdmin.productTypes = productTypes;
        roleUserAdmin.products = products;
        roleUserAdmin = yield roleUserAdmin.save();
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
        userAdmin = yield userAdmin.save();
        debug('插入admin账户数据库成功！！');
    }
    let platform = yield Platform_1.Platform.find();
    if (!platform) {
        platform = new Platform_1.Platform();
        platform.userWithdrawMin = 10;
        platform.siteWithdrawMin = 100;
        platform.siteYearPrice = 1000;
        platform.baseFunds = 0;
        platform.allProfit = 0;
        yield platform.save();
        debug('插入平台基础信息数据库成功！！');
    }
}))();
//# sourceMappingURL=initDataBase.js.map
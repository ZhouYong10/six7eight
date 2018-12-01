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
        let withdraw = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '提现记录',
            icon: 'el-icon-tickets',
            path: '/home/funds/manage/withdraws',
            fingerprint: 'withdrawsPlatform',
            parentId: fundsManage.id
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
        let productType = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '商品类别',
            icon: 'el-icon-tickets',
            path: '/home/product/type/manage',
            fingerprint: 'productTypePlatform',
            parentId: productManage.id
        });
        let productAll = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '所有商品',
            icon: 'el-icon-tickets',
            path: '/home/product/all/manage',
            fingerprint: 'productAllPlatform',
            parentId: productManage.id
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
        let placardSite = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '分站公告',
            icon: 'el-icon-tickets',
            path: '/home/placard/site/manage',
            fingerprint: 'placardSitePlatform',
            parentId: placardManage.id
        });
        let siteManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '分站管理',
            icon: 'el-icon-rank',
            path: '/home/site/manage',
            fingerprint: 'siteManagePlatform',
            parentId: null
        });
        let userManage = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '用户管理',
            icon: 'el-icon-rank',
            path: '/home/user/manage',
            fingerprint: 'userManagePlatform',
            parentId: null
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
        let feedbackUser = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '用户反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/user/manage',
            fingerprint: 'feedbackUserPlatform',
            parentId: feedbackManage.id
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
        let rightPlatform = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '平台权限',
            icon: 'el-icon-tickets',
            path: '/home/right/platform/manage',
            fingerprint: 'rightManagePlatform',
            parentId: settings.id
        });
        let rightSite = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '分站权限',
            icon: 'el-icon-tickets',
            path: '/home/right/site/manage',
            fingerprint: 'rightManageSite',
            parentId: settings.id
        });
        let rightUser = yield CRightAdmin_1.CRightAdmin.add({
            type: 'menu',
            name: '用户权限',
            icon: 'el-icon-tickets',
            path: '/home/right/user/manage',
            fingerprint: 'rightManageUser',
            parentId: settings.id
        });
        debug('插入平台权限数据成功！');
    }
    let rightSiteTree = yield CRightSite_1.CRightSite.show();
    if (rightSiteTree.length < 1) {
        let orderError = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '订单报错',
            icon: 'el-icon-document',
            path: 'order/error/manage',
            fingerprint: 'orderErrorSite',
            parentId: null
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
            path: 'recharge/records',
            fingerprint: 'rechargeSite',
            parentId: fundsManage.id
        });
        let consume = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '消费记录',
            icon: 'el-icon-tickets',
            path: 'consume/records',
            fingerprint: 'consumeSite',
            parentId: fundsManage.id
        });
        let profit = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '返利记录',
            icon: 'el-icon-tickets',
            path: 'profit/records',
            fingerprint: 'profitSite',
            parentId: fundsManage.id
        });
        let withdraw = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '申请提现',
            icon: 'el-icon-tickets',
            path: 'withdraw/records',
            fingerprint: 'withdrawSite',
            parentId: fundsManage.id
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
            path: 'product/type/manage',
            fingerprint: 'productTypeSite',
            parentId: productManage.id
        });
        let productAll = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '所有商品',
            icon: 'el-icon-tickets',
            path: 'product/all/manage',
            fingerprint: 'productAllSite',
            parentId: productManage.id
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
            path: 'admin/role/manage',
            fingerprint: 'adminRoleSite',
            parentId: adminManage.id
        });
        let adminList = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '管理员列表',
            icon: 'el-icon-tickets',
            path: 'admin/list/manage',
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
            path: 'user/role/manage',
            fingerprint: 'userRoleSite',
            parentId: userManage.id
        });
        let userList = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '用户列表',
            icon: 'el-icon-tickets',
            path: 'user/list/manage',
            fingerprint: 'userListSite',
            parentId: userManage.id
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
            path: 'feedback/mine/manage',
            fingerprint: 'feedbackSite',
            parentId: feedbackManage.id
        });
        let feedbackUser = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '用户反馈',
            icon: 'el-icon-tickets',
            path: 'feedback/user/manage',
            fingerprint: 'feedbackUserSite',
            parentId: feedbackManage.id
        });
        let placard = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '公告管理',
            icon: 'el-icon-message',
            path: 'placard/manage',
            fingerprint: 'placardSite',
            parentId: null
        });
        let settings = yield CRightSite_1.CRightSite.add({
            type: 'menu',
            name: '站点设置',
            icon: 'el-icon-setting',
            path: 'site/settings',
            fingerprint: 'settingsSite',
            parentId: null
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
            path: 'recharge/records',
            fingerprint: 'rechargeUser',
            parentId: fundsManage.id
        });
        let consume = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '消费记录',
            icon: 'el-icon-tickets',
            path: 'consume/records',
            fingerprint: 'consumeUser',
            parentId: fundsManage.id
        });
        let profit = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '返利记录',
            icon: 'el-icon-tickets',
            path: 'profit/records',
            fingerprint: 'profitUser',
            parentId: fundsManage.id
        });
        let withdraw = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '申请提现',
            icon: 'el-icon-tickets',
            path: 'withdraw/records',
            fingerprint: 'withdrawUser',
            parentId: fundsManage.id
        });
        let lowerUser = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '我的下级',
            icon: 'el-icon-share',
            path: 'lower/user',
            fingerprint: 'lowerUser',
            parentId: null
        });
        let feedback = yield CRightUser_1.CRightUser.add({
            type: 'menu',
            name: '问题反馈',
            icon: 'el-icon-question',
            path: 'feedback/records',
            fingerprint: 'feedbackUser',
            parentId: null
        });
        debug('插入用户权限数据成功！');
    }
    let roleUserAdmin = yield RoleUserAdmin_1.RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin_1.RoleUserAdmin();
        roleUserAdmin.type = RoleUserAdmin_1.RoleUserAdminType.Developer;
        roleUserAdmin.name = '开发者';
        roleUserAdmin.rights = yield RightAdmin_1.RightAdmin.getAllLeaf();
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
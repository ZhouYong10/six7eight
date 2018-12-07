import {UserAdmin} from "./entity/UserAdmin";
import {RoleUserAdmin, RoleUserAdminType} from "./entity/RoleUserAdmin";
import debuger = require("debug");
import {RightAdmin} from "./entity/RightAdmin";
import {CRightAdmin} from "./controler/CRightAdmin";
import {CRightSite} from "./controler/CRightSite";
import {CRightUser} from "./controler/CRightUser";
import {Platform} from "./entity/Platform";

const debug = debuger('six7eight:initDataBase');


(async () => {

    let rightAdminTree = await CRightAdmin.show();
    if (rightAdminTree.length < 1) {
        let orderError = await CRightAdmin.add({
            type: 'menu',
            name: '订单报错',
            icon: 'el-icon-document',
            path: '/home/order/error',
            fingerprint: 'orderErrorPlatform',
            parentId: null
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showOrderErrorPlatform',
            parentId: orderError.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealOrderErrorPlatform',
            parentId: orderError.id
        });


        let fundsManage = await CRightAdmin.add({
            type: 'menuGroup',
            name: '资金管理',
            icon: 'el-icon-star-on',
            path: '',
            fingerprint: 'fundsManagePlatform',
            parentId: null
        });
        let recharge = await CRightAdmin.add({
            type: 'menu',
            name: '充值记录',
            icon: 'el-icon-tickets',
            path: '/home/funds/manage/recharges',
            fingerprint: 'rechargesPlatform',
            parentId: fundsManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRechargePlatform',
            parentId: recharge.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '充值',
            icon: '',
            path: '',
            fingerprint: 'rechargeSuccessPlatform',
            parentId: recharge.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '失败',
            icon: '',
            path: '',
            fingerprint: 'rechargeFailPlatform',
            parentId: recharge.id
        });

        let withdraw = await CRightAdmin.add({
            type: 'menu',
            name: '提现记录',
            icon: 'el-icon-tickets',
            path: '/home/funds/manage/withdraws',
            fingerprint: 'withdrawsPlatform',
            parentId: fundsManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showWithdrawPlatform',
            parentId: withdraw.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '成功',
            icon: '',
            path: '',
            fingerprint: 'withdrawSuccessPlatform',
            parentId: withdraw.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '失败',
            icon: '',
            path: '',
            fingerprint: 'withdrawFailPlatform',
            parentId: withdraw.id
        });


        let productManage = await CRightAdmin.add({
            type: 'menuGroup',
            name: '商品管理',
            icon: 'el-icon-goods',
            path: '',
            fingerprint: 'productManagePlatform',
            parentId: null
        });
        let productField = await CRightAdmin.add({
            type: 'menu',
            name: '商品字段',
            icon: 'el-icon-tickets',
            path: '/home/product/field/manage',
            fingerprint: 'productFieldPlatform',
            parentId: productManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductFieldPlatform',
            parentId: productField.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductFieldPlatform',
            parentId: productField.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductFieldPlatform',
            parentId: productField.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deleteProductFieldPlatform',
            parentId: productField.id
        });

        let productType = await CRightAdmin.add({
            type: 'menu',
            name: '商品类别',
            icon: 'el-icon-tickets',
            path: '/home/product/type/manage',
            fingerprint: 'productTypePlatform',
            parentId: productManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductTypePlatform',
            parentId: productType.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductTypePlatform',
            parentId: productType.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductTypePlatform',
            parentId: productType.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductTypePlatform',
            parentId: productType.id
        });

        let productAll = await CRightAdmin.add({
            type: 'menu',
            name: '所有商品',
            icon: 'el-icon-tickets',
            path: '/home/product/all/manage',
            fingerprint: 'productAllPlatform',
            parentId: productManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductPlatform',
            parentId: productAll.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductPlatform',
            parentId: productAll.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductPlatform',
            parentId: productAll.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductPlatform',
            parentId: productAll.id
        });


        let placardManage = await CRightAdmin.add({
            type: 'menuGroup',
            name: '公告管理',
            icon: 'el-icon-message',
            path: '',
            fingerprint: 'placardManagePlatform',
            parentId: null
        });
        let placardPlatform = await CRightAdmin.add({
            type: 'menu',
            name: '平台公告',
            icon: 'el-icon-tickets',
            path: '/home/placard/platform/manage',
            fingerprint: 'placardPlatform',
            parentId: placardManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showPlacardPlatform',
            parentId: placardPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addPlacardPlatform',
            parentId: placardPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editPlacardPlatform',
            parentId: placardPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deletePlacardPlatform',
            parentId: placardPlatform.id
        });

        let placardSite = await CRightAdmin.add({
            type: 'menu',
            name: '分站公告',
            icon: 'el-icon-tickets',
            path: '/home/placard/site/manage',
            fingerprint: 'placardSitePlatform',
            parentId: placardManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showPlacardSitePlatform',
            parentId: placardSite.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deletePlacardSitePlatform',
            parentId: placardSite.id
        });


        let siteManage = await CRightAdmin.add({
            type: 'menu',
            name: '分站管理',
            icon: 'el-icon-rank',
            path: '/home/site/manage',
            fingerprint: 'siteManagePlatform',
            parentId: null
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showSitePlatform',
            parentId: siteManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addSitePlatform',
            parentId: siteManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editSitePlatform',
            parentId: siteManage.id
        });


        let userManage = await CRightAdmin.add({
            type: 'menu',
            name: '用户管理',
            icon: 'el-icon-rank',
            path: '/home/user/manage',
            fingerprint: 'userManagePlatform',
            parentId: null
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showUserManagePlatform',
            parentId: userManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '修改状态',
            icon: '',
            path: '',
            fingerprint: 'changeUserStatePlatform',
            parentId: userManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '修改金额',
            icon: '',
            path: '',
            fingerprint: 'changeUserFundsPlatform',
            parentId: userManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '备注',
            icon: '',
            path: '',
            fingerprint: 'remarkUserPlatform',
            parentId: userManage.id
        });


        let feedbackManage = await CRightAdmin.add({
            type: 'menuGroup',
            name: '问题反馈',
            icon: 'el-icon-question',
            path: '',
            fingerprint: 'feedbackManagePlatform',
            parentId: null
        });
        let feedbackSite = await CRightAdmin.add({
            type: 'menu',
            name: '站点反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/site/manage',
            fingerprint: 'feedbackSitePlatform',
            parentId: feedbackManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackSitePlatform',
            parentId: feedbackSite.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealFeedbackSitePlatform',
            parentId: feedbackSite.id
        });

        let feedbackUser = await CRightAdmin.add({
            type: 'menu',
            name: '用户反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/user/manage',
            fingerprint: 'feedbackUserPlatform',
            parentId: feedbackManage.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackUserPlatform',
            parentId: feedbackUser.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealFeedbackUserPlatform',
            parentId: feedbackUser.id
        });

        let adminManage = await CRightAdmin.add({
            type: 'menuGroup',
            name: '系统管理员',
            icon: 'el-icon-service',
            path: '',
            fingerprint: 'adminManagePlatform',
            parentId: null
        });
        let adminRole = await CRightAdmin.add({
            type: 'menu',
            name: '管理员角色',
            icon: 'el-icon-tickets',
            path: '/home/admin/role/manage',
            fingerprint: 'adminRolePlatform',
            parentId: adminManage.id
        });
        let adminList = await CRightAdmin.add({
            type: 'menu',
            name: '管理员列表',
            icon: 'el-icon-tickets',
            path: '/home/admin/list/manage',
            fingerprint: 'adminListPlatform',
            parentId: adminManage.id
        });


        let settings = await CRightAdmin.add({
            type: 'menuGroup',
            name: '系统设置',
            icon: 'el-icon-setting',
            path: '',
            fingerprint: 'settingsPlatform',
            parentId: null
        });
        let infoPlatform = await CRightAdmin.add({
            type: 'menu',
            name: '平台信息',
            icon: 'el-icon-tickets',
            path: '/home/info/platform/manage',
            fingerprint: 'infoPlatform',
            parentId: settings.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showInfoPlatform',
            parentId: infoPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editInfoPlatform',
            parentId: infoPlatform.id
        });

        let rightPlatform = await CRightAdmin.add({
            type: 'menu',
            name: '平台权限',
            icon: 'el-icon-tickets',
            path: '/home/right/platform/manage',
            fingerprint: 'rightManagePlatform',
            parentId: settings.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRightManagePlatform',
            parentId: rightPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单组',
            icon: '',
            path: '',
            fingerprint: 'addMenuGroupRightPlatform',
            parentId: rightPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单项',
            icon: '',
            path: '',
            fingerprint: 'addMenuRightPlatform',
            parentId: rightPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '权限树添加',
            icon: '',
            path: '',
            fingerprint: 'addTreeRightPlatform',
            parentId: rightPlatform.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '权限树编辑',
            icon: '',
            path: '',
            fingerprint: 'editTreeRightPlatform',
            parentId: rightPlatform.id
        });

        let rightSite = await CRightAdmin.add({
            type: 'menu',
            name: '分站权限',
            icon: 'el-icon-tickets',
            path: '/home/right/site/manage',
            fingerprint: 'rightManageSite',
            parentId: settings.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRightManageSite',
            parentId: rightSite.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单组',
            icon: '',
            path: '',
            fingerprint: 'addMenuGroupRightSite',
            parentId: rightSite.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单项',
            icon: '',
            path: '',
            fingerprint: 'addMenuRightSite',
            parentId: rightSite.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '权限树添加',
            icon: '',
            path: '',
            fingerprint: 'addTreeRightSite',
            parentId: rightSite.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '权限树编辑',
            icon: '',
            path: '',
            fingerprint: 'editTreeRightSite',
            parentId: rightSite.id
        });

        let rightUser = await CRightAdmin.add({
            type: 'menu',
            name: '用户权限',
            icon: 'el-icon-tickets',
            path: '/home/right/user/manage',
            fingerprint: 'rightManageUser',
            parentId: settings.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRightManageUser',
            parentId: rightUser.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单组',
            icon: '',
            path: '',
            fingerprint: 'addMenuGroupRightUser',
            parentId: rightUser.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '添加菜单项',
            icon: '',
            path: '',
            fingerprint: 'addMenuRightUser',
            parentId: rightUser.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '权限树添加',
            icon: '',
            path: '',
            fingerprint: 'addTreeRightUser',
            parentId: rightUser.id
        });
        await CRightAdmin.add({
            type: 'menuItem',
            name: '权限树编辑',
            icon: '',
            path: '',
            fingerprint: 'editTreeRightUser',
            parentId: rightUser.id
        });

        debug('插入平台权限数据成功！');
    }

    let rightSiteTree = await CRightSite.show();
    if (rightSiteTree.length < 1) {
        let orderError = await CRightSite.add({
            type: 'menu',
            name: '订单报错',
            icon: 'el-icon-document',
            path: '/home/order/error/manage',
            fingerprint: 'orderErrorSite',
            parentId: null
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showOrderErrorSite',
            parentId: orderError.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealOrderErrorSite',
            parentId: orderError.id
        });


        let fundsManage = await CRightSite.add({
            type: 'menuGroup',
            name: '资金管理',
            icon: 'el-icon-star-on',
            path: '',
            fingerprint: 'fundsManageSite',
            parentId: null
        });
        let recharge = await CRightSite.add({
            type: 'menu',
            name: '在线充值',
            icon: 'el-icon-tickets',
            path: '/home/recharge/records',
            fingerprint: 'rechargeSite',
            parentId: fundsManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRechargeSite',
            parentId: recharge.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '充值',
            icon: '',
            path: '',
            fingerprint: 'addRechargeSite',
            parentId: recharge.id
        });

        let consume = await CRightSite.add({
            type: 'menu',
            name: '消费记录',
            icon: 'el-icon-tickets',
            path: '/home/consume/records',
            fingerprint: 'consumeSite',
            parentId: fundsManage.id
        });
        let profit = await CRightSite.add({
            type: 'menu',
            name: '返利记录',
            icon: 'el-icon-tickets',
            path: '/home/profit/records',
            fingerprint: 'profitSite',
            parentId: fundsManage.id
        });

        let withdraw = await CRightSite.add({
            type: 'menu',
            name: '申请提现',
            icon: 'el-icon-tickets',
            path: '/home/withdraw/records',
            fingerprint: 'withdrawSite',
            parentId: fundsManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showWithdrawSite',
            parentId: withdraw.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '提现',
            icon: '',
            path: '',
            fingerprint: 'addWithdrawSite',
            parentId: withdraw.id
        });


        let productManage = await CRightSite.add({
            type: 'menuGroup',
            name: '商品管理',
            icon: 'el-icon-goods',
            path: '',
            fingerprint: 'productManageSite',
            parentId: null
        });
        let productType = await CRightSite.add({
            type: 'menu',
            name: '商品类别',
            icon: 'el-icon-tickets',
            path: '/home/product/type/manage',
            fingerprint: 'productTypeSite',
            parentId: productManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductTypeSite',
            parentId: productType.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductTypeSite',
            parentId: productType.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductTypeSite',
            parentId: productType.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductTypeSite',
            parentId: productType.id
        });

        let productAll = await CRightSite.add({
            type: 'menu',
            name: '所有商品',
            icon: 'el-icon-tickets',
            path: '/home/product/all/manage',
            fingerprint: 'productAllSite',
            parentId: productManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showProductAllSite',
            parentId: productAll.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addProductAllSite',
            parentId: productAll.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '上下架',
            icon: '',
            path: '',
            fingerprint: 'onSaleProductAllSite',
            parentId: productAll.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editProductAllSite',
            parentId: productAll.id
        });


        let adminManage = await CRightSite.add({
            type: 'menuGroup',
            name: '站点管理员',
            icon: 'el-icon-service',
            path: '',
            fingerprint: 'adminManageSite',
            parentId: null
        });
        let adminRole = await CRightSite.add({
            type: 'menu',
            name: '管理员角色',
            icon: 'el-icon-tickets',
            path: '/home/admin/role/manage',
            fingerprint: 'adminRoleSite',
            parentId: adminManage.id
        });
        let adminList = await CRightSite.add({
            type: 'menu',
            name: '管理员列表',
            icon: 'el-icon-tickets',
            path: '/home/admin/list/manage',
            fingerprint: 'adminListSite',
            parentId: adminManage.id
        });


        let userManage = await CRightSite.add({
            type: 'menuGroup',
            name: '用户管理',
            icon: 'el-icon-rank',
            path: '',
            fingerprint: 'userManageSite',
            parentId: null
        });
        let userRole = await CRightSite.add({
            type: 'menu',
            name: '用户角色',
            icon: 'el-icon-tickets',
            path: '/home/user/role/manage',
            fingerprint: 'userRoleSite',
            parentId: userManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showUserRoleSite',
            parentId: userRole.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editUserRoleSite',
            parentId: userRole.id
        });

        let userList = await CRightSite.add({
            type: 'menu',
            name: '用户列表',
            icon: 'el-icon-tickets',
            path: '/home/user/list/manage',
            fingerprint: 'userListSite',
            parentId: userManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showUserListSite',
            parentId: userList.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addUserListSite',
            parentId: userList.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '修改状态',
            icon: '',
            path: '',
            fingerprint: 'changeStateUserListSite',
            parentId: userList.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '备注',
            icon: '',
            path: '',
            fingerprint: 'remarkUserListSite',
            parentId: userList.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editUserListSite',
            parentId: userList.id
        });


        let feedbackManage = await CRightSite.add({
            type: 'menuGroup',
            name: '问题反馈',
            icon: 'el-icon-question',
            path: '',
            fingerprint: 'feedbackManageSite',
            parentId: null
        });
        let feedbackSite = await CRightSite.add({
            type: 'menu',
            name: '我的反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/mine/manage',
            fingerprint: 'feedbackSite',
            parentId: feedbackManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackSite',
            parentId: feedbackSite.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addFeedbackSite',
            parentId: feedbackSite.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editFeedbackSite',
            parentId: feedbackSite.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'deleteFeedbackSite',
            parentId: feedbackSite.id
        });

        let feedbackUser = await CRightSite.add({
            type: 'menu',
            name: '用户反馈',
            icon: 'el-icon-tickets',
            path: '/home/feedback/user/manage',
            fingerprint: 'feedbackUserSite',
            parentId: feedbackManage.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackUserSite',
            parentId: feedbackUser.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '处理',
            icon: '',
            path: '',
            fingerprint: 'dealFeedbackUserSite',
            parentId: feedbackUser.id
        });


        let placard = await CRightSite.add({
            type: 'menu',
            name: '公告管理',
            icon: 'el-icon-message',
            path: '/home/placard/manage',
            fingerprint: 'placardSite',
            parentId: null
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showPlacardSite',
            parentId: placard.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addPlacardSite',
            parentId: placard.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editPlacardSite',
            parentId: placard.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '删除',
            icon: '',
            path: '',
            fingerprint: 'dealPlacardSite',
            parentId: placard.id
        });


        let settings = await CRightSite.add({
            type: 'menu',
            name: '站点设置',
            icon: 'el-icon-setting',
            path: '/home/site/settings',
            fingerprint: 'settingsSite',
            parentId: null
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showSettingsSite',
            parentId: settings.id
        });
        await CRightSite.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editSettingsSite',
            parentId: settings.id
        });

        debug('插入分站权限数据成功！');
    }

    let rightUserTree = await CRightUser.show();
    if (rightUserTree.length < 1) {
        let fundsManage = await CRightUser.add({
            type: 'menuGroup',
            name: '资金管理',
            icon: 'el-icon-star-on',
            path: '',
            fingerprint: 'fundsManageUser',
            parentId: null
        });
        let recharge = await CRightUser.add({
            type: 'menu',
            name: '在线充值',
            icon: 'el-icon-tickets',
            path: '/recharge/records',
            fingerprint: 'rechargeUser',
            parentId: fundsManage.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRechargeUser',
            parentId: recharge.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '充值',
            icon: '',
            path: '',
            fingerprint: 'addRechargeUser',
            parentId: recharge.id
        });

        let consume = await CRightUser.add({
            type: 'menu',
            name: '消费记录',
            icon: 'el-icon-tickets',
            path: '/consume/records',
            fingerprint: 'consumeUser',
            parentId: fundsManage.id
        });
        let profit = await CRightUser.add({
            type: 'menu',
            name: '返利记录',
            icon: 'el-icon-tickets',
            path: '/profit/records',
            fingerprint: 'profitUser',
            parentId: fundsManage.id
        });

        let withdraw = await CRightUser.add({
            type: 'menu',
            name: '申请提现',
            icon: 'el-icon-tickets',
            path: '/withdraw/records',
            fingerprint: 'withdrawUser',
            parentId: fundsManage.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showWithdrawUser',
            parentId: withdraw.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '提现',
            icon: '',
            path: '',
            fingerprint: 'addWithdrawUser',
            parentId: withdraw.id
        });


        let roleUp = await CRightUser.add({
            type: 'menu',
            name: '代理升级',
            icon: 'el-icon-upload2',
            path: '/user/role/up',
            fingerprint: 'roleUpUser',
            parentId: null
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showRoleUpUser',
            parentId: roleUp.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '升级',
            icon: '',
            path: '',
            fingerprint: 'canRoleUpUser',
            parentId: roleUp.id
        });

        
        let lowerUser = await CRightUser.add({
            type: 'menu',
            name: '我的下级',
            icon: 'el-icon-share',
            path: '/lower/user',
            fingerprint: 'lowerUser',
            parentId: null
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showLowerUser',
            parentId: lowerUser.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addLowerUser',
            parentId: lowerUser.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '编辑',
            icon: '',
            path: '',
            fingerprint: 'editLowerUser',
            parentId: lowerUser.id
        });

        
        let feedback = await CRightUser.add({
            type: 'menu',
            name: '问题反馈',
            icon: 'el-icon-question',
            path: '/feedback/records',
            fingerprint: 'feedbackUser',
            parentId: null
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '显示',
            icon: '',
            path: '',
            fingerprint: 'showFeedbackUser',
            parentId: feedback.id
        });
        await CRightUser.add({
            type: 'menuItem',
            name: '添加',
            icon: '',
            path: '',
            fingerprint: 'addFeedbackUser',
            parentId: feedback.id
        });

        debug('插入用户权限数据成功！');
    }

    let roleUserAdmin = await RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        let adminRights = await RightAdmin.getAllPermissions();
        roleUserAdmin = new RoleUserAdmin();
        roleUserAdmin.type = RoleUserAdminType.Developer;
        roleUserAdmin.name = '开发者';
        roleUserAdmin.editRights = adminRights
        roleUserAdmin.rights = adminRights;
        let roleUserAdminSaved = await roleUserAdmin.save();
        debug('插入开发者角色数据库成功！！');
    }

    let userAdmin = await UserAdmin.findByName('admin');
    if (!userAdmin) {
        userAdmin = new UserAdmin();
        userAdmin.username = 'admin';
        userAdmin.password = 'admin';
        userAdmin.qq = '';
        userAdmin.phone = '';
        userAdmin.weixin = '';
        userAdmin.email = '';
        userAdmin.role = roleUserAdmin;
        let userAdminSaved = await userAdmin.save();
        debug('插入admin账户数据库成功！！');
    }

    let platform = await Platform.find();
    if (!platform) {
        platform = new Platform();
        platform.userWithdrawMin = 0;
        platform.siteWithdrawMin = 0;
        platform.goldUpPrice = 0;
        platform.superUpPrice = 0;
        platform.upperRatio = 0;
        platform.siteRatio = 0;
        platform.siteYearPrice = 0;
        platform.baseFunds = 0;
        platform.allProfit = 0;
        await platform.save();
        debug('插入平台基础信息数据库成功！！');
    }
})();



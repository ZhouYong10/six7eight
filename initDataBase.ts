import {UserAdmin} from "./entity/UserAdmin";
import {RoleUserAdmin, RoleUserAdminType} from "./entity/RoleUserAdmin";
import debuger = require("debug");
import {RightAdmin} from "./entity/RightAdmin";
import {RightType} from "./entity/RightBase";
import {RightUser} from "./entity/RightUser";
import {RightSite} from "./entity/RightSite";

const debug = debuger('six7eight:initDataBase');


(async () => {

    let rightAdminTree = await RightAdmin.findTrees();
    if (rightAdminTree.length < 1) {
        let orderError = new RightAdmin();
        orderError.name = '订单报错';
        orderError.type = RightType.Menu;
        orderError.componentName = 'orderError';
        orderError.icon = 'el-icon-document';
        let orderErrorSaved = await orderError.save();

        let fundsMenu = new RightAdmin();
        fundsMenu.name = '资金管理';
        fundsMenu.type = RightType.MenuGroup;
        fundsMenu.icon = 'el-icon-star-on';
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
        let productMenuSaved = await productMenu.save();

        let productField = new RightAdmin();
        productField.name = '商品字段';
        productField.type = RightType.Page;
        productField.componentName = 'productFields';
        productField.parent = productMenuSaved;
        let productFieldSaved = await productField.save();

        let productTypes = new RightAdmin();
        productTypes.name = '商品类别';
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
        siteMenu.type = RightType.Menu;
        siteMenu.icon = 'el-icon-rank';
        siteMenu.componentName = 'sites';
        let siteMenuSaved = await siteMenu.save();

        let users = new RightAdmin();
        users.name = '用户管理';
        users.type = RightType.Menu;
        users.icon = 'el-icon-rank';
        users.componentName = 'users';
        let usersSaved = await users.save();

        let feedbackMenu = new RightAdmin();
        feedbackMenu.name = '问题反馈';
        feedbackMenu.type = RightType.MenuGroup;
        feedbackMenu.icon = 'el-icon-question';
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
        let adminMenuSaved = await adminMenu.save();

        let adminsRole = new RightAdmin();
        adminsRole.name = '管理员角色';
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
        let settingsMenuSaved = await settingsMenu.save();

        let rightAdmin = new RightAdmin();
        rightAdmin.name = '平台权限';
        rightAdmin.type = RightType.Page;
        rightAdmin.componentName = 'right';
        rightAdmin.parent = settingsMenuSaved;
        let rightSaved = await rightAdmin.save();

        let rightSite = new RightAdmin();
        rightSite.name = '分站权限';
        rightSite.type = RightType.Page;
        rightSite.componentName = 'siteRight';
        rightSite.parent = settingsMenuSaved;
        let rightSiteSaved = await rightSite.save();

        let rightUser = new RightAdmin();
        rightUser.name = '用户权限';
        rightUser.type = RightType.Page;
        rightUser.componentName = 'userRight';
        rightUser.parent = settingsMenuSaved;
        let rightUserSaved = await rightUser.save();

        debug('插入平台权限数据成功！');
    }

    let rightSiteTree = await RightSite.findTrees();
    if (rightSiteTree.length < 1) {
        let orderError = new RightSite();
        orderError.name = '订单报错';
        orderError.type = RightType.Menu;
        orderError.icon = 'el-icon-document';
        orderError.componentName = 'orderError';
        let orderErrorSaved = await orderError.save();

        let fundsManage = new RightSite();
        fundsManage.name = '资金管理';
        fundsManage.type = RightType.MenuGroup;
        fundsManage.icon = 'el-icon-star-on';
        let fundsManageSaved = await fundsManage.save();

        let recharge = new RightSite();
        recharge.name = '在线充值';
        recharge.type = RightType.Page;
        recharge.componentName = 'recharge';
        recharge.parent = fundsManageSaved;
        let rechargeSaved = await recharge.save();

        let rechargeRecord = new RightSite();
        rechargeRecord.name = '充值记录';
        rechargeRecord.type = RightType.Page;
        rechargeRecord.componentName = 'rechargeRecord';
        rechargeRecord.parent = fundsManageSaved;
        let rechargeRecordSaved = await rechargeRecord.save();

        let consumeRecord = new RightSite();
        consumeRecord.name = '消费记录';
        consumeRecord.type = RightType.Page;
        consumeRecord.componentName = 'consumeRecord';
        consumeRecord.parent = fundsManageSaved;
        let consumeRecordSaved = await consumeRecord.save();

        let profitRecord = new RightSite();
        profitRecord.name = '返利记录';
        profitRecord.type = RightType.Page;
        profitRecord.componentName = 'profitRecord';
        profitRecord.parent = fundsManageSaved;
        let profitRecordSaved = await profitRecord.save();

        let withdraw = new RightSite();
        withdraw.name = '申请提现';
        withdraw.type = RightType.Page;
        withdraw.componentName = 'withdraw';
        withdraw.parent = fundsManageSaved;
        let withdrawSaved = await withdraw.save();

        let withdrawRecord = new RightSite();
        withdrawRecord.name = '提现记录';
        withdrawRecord.type = RightType.Page;
        withdrawRecord.componentName = 'withdrawRecord';
        withdrawRecord.parent = fundsManageSaved;
        let withdrawRecordSaved = await withdrawRecord.save();

        let productMenu = new RightSite();
        productMenu.name = '商品管理';
        productMenu.type = RightType.MenuGroup;
        productMenu.icon = 'el-icon-goods';
        let productMenuSaved = await productMenu.save();

        let productType = new RightSite();
        productType.name = '商品类别';
        productType.type = RightType.Page;
        productType.componentName = 'productType';
        productType.parent = productMenuSaved;
        let productTypeSaved = await productType.save();

        let product = new RightSite();
        product.name = '所有商品';
        product.type = RightType.Page;
        product.componentName = 'product';
        product.parent = productMenuSaved;
        let productSaved = await product.save();

        let adminManage = new RightSite();
        adminManage.name = '站点管理员';
        adminManage.type = RightType.MenuGroup;
        adminManage.icon = 'el-icon-service';
        let adminManageSaved = await adminManage.save();

        let adminRole = new RightSite();
        adminRole.name = '管理员角色';
        adminRole.type = RightType.Page;
        adminRole.componentName = 'adminRole';
        adminRole.parent = adminManageSaved;
        let adminRoleSaved = await adminRole.save();

        let admins = new RightSite();
        admins.name = '管理员列表';
        admins.type = RightType.Page;
        admins.componentName = 'admins';
        admins.parent = adminManageSaved;
        let adminsSaved = await admins.save();

        let userManage = new RightSite();
        userManage.name = '用户管理';
        userManage.type = RightType.MenuGroup;
        userManage.icon = 'el-icon-rank';
        let userManageSaved = await userManage.save();

        let userRole = new RightSite();
        userRole.name = '用户角色';
        userRole.type = RightType.Page;
        userRole.componentName = 'usersRole';
        userRole.parent = userManageSaved;
        let userRoleSaved = await userRole.save();

        let users = new RightSite();
        users.name = '用户列表';
        users.type = RightType.Page;
        users.componentName = 'users';
        users.parent = userManageSaved;
        let usersSaved = await users.save();

        let feedbackManage = new RightSite();
        feedbackManage.name = '问题反馈';
        feedbackManage.type = RightType.MenuGroup;
        feedbackManage.icon = 'el-icon-question';
        let feedbackManageSaved = await feedbackManage.save();

        let feedback = new RightSite();
        feedback.name = '我的反馈';
        feedback.type = RightType.Page;
        feedback.componentName = 'feedback';
        feedback.parent = feedbackManageSaved;
        let feedbackSaved = await feedback.save();

        let userFeedback = new RightSite();
        userFeedback.name = '用户反馈';
        userFeedback.type = RightType.Page;
        userFeedback.componentName = 'userFeedback';
        userFeedback.parent = feedbackManageSaved;
        let userFeedbackSaved = await userFeedback.save();

        let placard = new RightSite();
        placard.name = '公告管理';
        placard.type = RightType.Menu;
        placard.componentName = 'placard';
        placard.icon = 'el-icon-message';
        let placardSaved = await placard.save();

        let settings = new RightSite();
        settings.name = '站点设置';
        settings.type = RightType.Menu;
        settings.componentName = 'settings';
        settings.icon = 'el-icon-setting';
        let settingsSaved = await settings.save();

        debug('插入分站权限数据成功！');
    }

    let rightUserTree = await RightUser.findTrees();
    if (rightUserTree.length < 1) {
        let fundsManage = new RightUser();
        fundsManage.name = '资金管理';
        fundsManage.type = RightType.MenuGroup;
        fundsManage.icon = 'el-icon-star-on';
        let fundsManageSaved = await fundsManage.save();

        let recharge = new RightUser();
        recharge.name = '在线充值';
        recharge.type = RightType.Page;
        recharge.componentName = 'recharge';
        recharge.parent = fundsManageSaved;
        let rechargeSaved = await recharge.save();

        let rechargeRecord = new RightUser();
        rechargeRecord.name = '充值记录';
        rechargeRecord.type = RightType.Page;
        rechargeRecord.componentName = 'rechargeRecord';
        rechargeRecord.parent = fundsManageSaved;
        let rechargeRecordSaved = await rechargeRecord.save();

        let consumeRecord = new RightUser();
        consumeRecord.name = '消费记录';
        consumeRecord.type = RightType.Page;
        consumeRecord.componentName = 'consumeRecord';
        consumeRecord.parent = fundsManageSaved;
        let consumeRecordSaved = await consumeRecord.save();

        let profitRecord = new RightUser();
        profitRecord.name = '返利记录';
        profitRecord.type = RightType.Page;
        profitRecord.componentName = 'profitRecord';
        profitRecord.parent = fundsManageSaved;
        let profitRecordSaved = await profitRecord.save();

        let withdraw = new RightUser();
        withdraw.name = '申请提现';
        withdraw.type = RightType.Page;
        withdraw.componentName = 'withdraw';
        withdraw.parent = fundsManageSaved;
        let withdrawSaved = await withdraw.save();

        let withdrawRecord = new RightUser();
        withdrawRecord.name = '提现记录';
        withdrawRecord.type = RightType.Page;
        withdrawRecord.componentName = 'withdrawRecord';
        withdrawRecord.parent = fundsManageSaved;
        let withdrawRecordSaved = await withdrawRecord.save();

        let lowerUsers = new RightUser();
        lowerUsers.name = '我的下级';
        lowerUsers.type = RightType.Menu;
        lowerUsers.componentName = 'lowerUsers';
        lowerUsers.icon = 'el-icon-share';
        let lowerUsersSaved = await lowerUsers.save();

        let feedback = new RightUser();
        feedback.name = '问题反馈';
        feedback.type = RightType.Menu;
        feedback.componentName = 'feedback';
        feedback.icon = 'el-icon-question';
        let feedbackSaved = await feedback.save();

        debug('插入用户权限数据成功！');
    }

    let roleUserAdmin = await RoleUserAdmin.findByName('开发者');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin();
        roleUserAdmin.type = RoleUserAdminType.Developer;
        roleUserAdmin.name = '开发者';
        roleUserAdmin.rights = await RightAdmin.getAllLeaf();
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
})();



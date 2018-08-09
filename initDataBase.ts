import {UserAdmin} from "./entity/UserAdmin";
import {RoleUserAdmin} from "./entity/RoleUserAdmin";
import debuger = require("debug");
import {RightAdmin} from "./entity/RightAdmin";
import {RightType} from "./entity/RightBase";
import set = Reflect.set;

const debug = debuger('six7eight:initDataBase');


(async () => {
    let roleUserAdmin = await RoleUserAdmin.findByName('系统管理员');
    if (!roleUserAdmin) {
        roleUserAdmin = new RoleUserAdmin();
        roleUserAdmin.name = '系统管理员';
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



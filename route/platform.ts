import * as Router from "koa-router";
import {Context} from "koa";
import * as passport from "passport";
import * as debuger from "debug";
import {comparePass, MsgRes, now} from "../utils";
import {UserType} from "../entity/UserBase";
import {CRightAdmin} from "../controler/CRightAdmin";
import {CRoleUserAdmin} from "../controler/CRoleUserAdmin";
import {CUserAdmin} from "../controler/CUserAdmin";
import {CSite} from "../controler/CSite";
import {CRightSite} from "../controler/CRightSite";
import {CRightUser} from "../controler/CRightUser";
import {CProductTypes} from "../controler/CProductTypes";
import {CProduct} from "../controler/CProduct";
import {CFeedbackUserSite} from "../controler/CFeedbackUserSite";
import {CFeedbackUser} from "../controler/CFeedbackUser";
import {CPlacardUser} from "../controler/CPlacardUser";
import {CPlacardUserSite} from "../controler/CPlacardUserSite";
import {CUser} from "../controler/CUser";
import {CRecharge} from "../controler/CRecharge";
import {CWithdraw} from "../controler/CWithdraw";
import {CUserSite} from "../controler/CUserSite";
import {CProductField} from "../controler/CProductField";
import {COrderUser} from "../controler/COrderUser";
import {RightAdmin} from "../entity/RightAdmin";
import {RoleUserAdminType} from "../entity/RoleUserAdmin";
import {CErrorOrderUser} from "../controler/CErrorOrderUser";
import {Platform} from "../entity/Platform";

const debug = (info: any, msg?: string) => {
    const debug = debuger('six7eight:route_platform');
    debug(JSON.stringify(info) + '  ' + msg);
};
const platformAuth = new Router();

export async function platformRoute(router: Router) {

    /* 登录入口 */
    router.post('/platform/login', passport.authenticate('platform'), async (ctx: Context) => {
        let user = ctx.state.user;
        user.lastLoginTime = now();
        user = await user.save();
        let productMenus = await CProductTypes.productsRight();
        let rightMenus = await RightAdmin.findTrees();
        let menus = user.role.treeRights(productMenus.concat(rightMenus));
        ctx.body = new MsgRes(true, '登录成功！', {
            userId: user.id,
            username: user.username,
            userState: user.state,
            roleId: user.role.id,
            roleType: user.role.type,
            roleName: user.role.name,
            menus: menus,
            permissions: user.role.rights
        });
    });

    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/platform/logined', (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Platform) {
            ctx.body = new MsgRes(true);
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/platform/auth/*', (ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Platform) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 退出登录 */
    platformAuth.get('/logout', (ctx: Context) => {
        ctx.logout();
        ctx.body = new MsgRes(true, '退出登录');
    });

    /* 管理员信息 */
    platformAuth.get('/admin/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.findById(ctx.params.id));
    });

    platformAuth.post('/adminInfo/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.updateContact(ctx.request.body));
    });

    platformAuth.post('/compare/pass', async (ctx: Context) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    platformAuth.post('/change/pass', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.changePass({
            user: ctx.state.user,
            ...ctx.request.body
        }));
    });

    /* 订单管理 */
    platformAuth.get('/orders/:productId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.findPlatformOrdersByProductId(ctx.params.productId));
    });

    /* 订单报错管理 */
    platformAuth.get('/all/order/errors', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CErrorOrderUser.platformAll());
    });

    /* 资金管理 */
    // 充值记录
    platformAuth.get('/recharge/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.all());
    });

    platformAuth.post('/hand/recharge', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.handRecharge(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/hand/recharge/fail', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.handRechargeFail(ctx.request.body));
    });

    // 提现记录
    platformAuth.get('/withdraw/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.all());
    });

    platformAuth.get('/hand/withdraw/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.handWithdraw(ctx.params.id, (ctx as any).io));
    });

    platformAuth.post('/hand/withdraw/fail', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.handWithdrawFail(ctx.request.body, (ctx as any).io));
    });

    /* 商品字段管理 */
    platformAuth.get('/product/fields', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductField.getAll());
    });

    platformAuth.get('/product/field/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductField.findByName(ctx.params.name));
    });

    platformAuth.post('/product/field/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductField.add(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/product/field/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductField.update(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/product/field/remove/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductField.delById(ctx.params.id));
    });

    /* 商品类别管理 */
    platformAuth.get('/product/types', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.getAll());
    });

    platformAuth.post('/product/type/set/onsale', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.setOnSale(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/product/type/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.findByName(ctx.params.name));
    });

    platformAuth.post('/product/type/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.add(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/product/type/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.update(ctx.request.body, (ctx as any).io));
    });

    /* 商品管理 */
    platformAuth.get('/products', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.getAll());
    });

    platformAuth.post('/product/set/onsale', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.setOnSale(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/:typeId/product/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.findByNameAndTypeId(ctx.params.typeId, ctx.params.name));
    });

    platformAuth.post('/product/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.add(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/product/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProduct.update(ctx.request.body, (ctx as any).io));
    });

    /* 发送给分站管理员及分站用户的公告管理 */
    platformAuth.get('/placards', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.getAll());
    });

    platformAuth.post('/placard/add', async (ctx: Context) => {
        let info: any = ctx.request.body;
        info.user = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.add(info));
    });

    platformAuth.post('/placard/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.update(ctx.request.body));
    });

    platformAuth.get('/placard/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.delById(ctx.params.id));
    });

    /* 分站发布的公告管理 */
    platformAuth.get('/sites/placards', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.getAll());
    });

    platformAuth.get('/site/placard/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.delById(ctx.params.id));
    });

    /* 站点管理 */
    platformAuth.get('/sites', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.all());
    });

    platformAuth.get('/site/admin/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findByUsername(ctx.params.username))
    });

    platformAuth.get('/site/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.findByName(ctx.params.name));
    });

    platformAuth.post('/site/address/exist', async (ctx: Context) => {
        let info: any = ctx.request.body;
        ctx.body = new MsgRes(true, '', await CSite.findByAddress(info.address));
    });

    platformAuth.post('/site/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.add(ctx.request.body));
    });

    platformAuth.post('/site/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.update(ctx.request.body, (ctx as any).io));
    });

    /* 用户管理 */
    platformAuth.get('/users', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.all());
    });

    platformAuth.post('/user/change/funds', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.changeFunds(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/user/change/state', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.changeState(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/user/add/remark', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.addUserAdminRemark(ctx.request.body, ctx.state.user));
    });

    platformAuth.get('/user/:userId/remarks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.loadRemarksByUserAdmin(ctx.params.userId, ctx.state.user.id));
    });

    /* 处理分站问题反馈 */
    platformAuth.get('/site/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.getAll());
    });

    platformAuth.post('/site/feedback/deal', async (ctx: Context) => {
        let info: any = ctx.request.body;
        info.dealTime = now();
        info.dealUser = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.deal(info));
    });

    /* 处理分站用户问题反馈 */
    platformAuth.get('/site/user/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.getAll());
    });

    platformAuth.post('/site/user/feedback/deal', async (ctx: Context) => {
        let info: any = ctx.request.body;
        info.dealTime = now();
        info.dealUser = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.deal(info));
    });

    /* 平台管理员操作 */
    platformAuth.get('/admins', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.allAdmins());
    });

    platformAuth.get('/admin/roles/type/user', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.typeUserRoles());
    });

    platformAuth.get('/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.findByUsername(ctx.params.username))
    });

    platformAuth.post('/admin/save', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.save(ctx.request.body));
    });

    platformAuth.post('/admin/change/role', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.changeRole(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/admin/change/state', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.changeState(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/admin/del/:id', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.delById(ctx.params.id));
    });

    /* 平台管理员角色操作 */
    platformAuth.get('/role/view/rights', async (ctx: Context) => {
        let productRights = await CProductTypes.productsRight();
        let rights = await RightAdmin.findTrees();
        ctx.body = new MsgRes(true, '', productRights.concat(rights));
    });

    platformAuth.get('/admin/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.allRoles());
    });

    platformAuth.get('/role/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.findByName(ctx.params.name));
    });

    platformAuth.post('/role/save', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.saveOne(ctx.request.body));
    });

    platformAuth.post('/role/update', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.update(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/role/remove/:id', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.delById(ctx.params.id));
    });

    /* 平台基础信息管理 */
    platformAuth.get('/platform/info', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await Platform.find());
    });

    platformAuth.post('/platform/info/update', async (ctx: Context) => {
        let info:any = ctx.request.body;
        let id = info.id;
        delete info.id;

        let io = (ctx as any).io;
        io.emit('changePlatformInfo', {
            canRegister: info.canRegister,
            canAddUser: info.canAddUser,
            goldUpPrice: info.goldUpPrice,
            superUpPrice: info.superUpPrice,
        })
        ctx.body = new MsgRes(true, '', await Platform.update(id, info));
    });

    /* 平台管理员权限操作 */
    platformAuth.get('/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.show());
    });

    platformAuth.post('/right/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.add(ctx.request.body));
    });

    platformAuth.post('/right/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.update(ctx.request.body));
    });

    platformAuth.post('/platform/right/change/sort', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.changeRightSort(ctx.request.body))
    });

    /* 站点管理员权限操作 */
    platformAuth.get('/site/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.show());
    });

    platformAuth.post('/site/right/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.add(ctx.request.body));
    });

    platformAuth.post('/site/right/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.update(ctx.request.body));
    });

    platformAuth.post('/site/right/change/sort', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightSite.changeRightSort(ctx.request.body))
    });

    /* 站点用户权限操作 */
    platformAuth.get('/user/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.show());
    });

    platformAuth.post('/user/right/save', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.add(ctx.request.body));
    });

    platformAuth.post('/user/right/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.update(ctx.request.body));
    });

    platformAuth.post('/user/right/change/sort', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.changeRightSort(ctx.request.body))
    });

    router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
}
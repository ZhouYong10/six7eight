import * as Router from "koa-router";
import {Context} from "koa";
import {comparePass, MsgRes, now} from "../utils";
import {UserType} from "../entity/UserBase";
import * as passport from "passport";
import {CUserSite} from "../controler/CUserSite";
import {CRoleUserSite} from "../controler/CRoleUserSite";
import {CProductTypeSite} from "../controler/CProductTypeSite";
import {CProductSite} from "../controler/CProductSite";
import {CRoleUser} from "../controler/CRoleUser";
import {CRightUser} from "../controler/CRightUser";
import {CPlacardUser} from "../controler/CPlacardUser";
import {CSite} from "../controler/CSite";
import {CFeedbackUserSite} from "../controler/CFeedbackUserSite";
import {CUser} from "../controler/CUser";
import {CFeedbackUser} from "../controler/CFeedbackUser";
import {RechargeType, RechargeWay} from "../entity/Recharge";
import {CRechargeCode} from "../controler/CRechargeCode";
import {CRecharge} from "../controler/CRecharge";
import {WithdrawType} from "../entity/Withdraw";
import {CWithdraw} from "../controler/CWithdraw";
import {CProductField} from "../controler/CProductField";
import {COrderUser} from "../controler/COrderUser";
import {RightSite} from "../entity/RightSite";
import {RoleUserSiteType} from "../entity/RoleUserSite";

const siteAuth = new Router();

export async function siteRoute(router: Router) {

    /* 登录入口 */
    router.post('/site/login', async (ctx: Context) => {
        const params: any = ctx.request.body;
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('site', async (err, user, info, status) => {
                if (user) {
                    ctx.login(user);
                    await CUserSite.updateLoginTime({id: user.id, time: now()});
                    let productRights = await CProductTypeSite.productsRight(user.site.id);
                    let rights = await RightSite.findTrees();
                    let treeRights = user.role.treeRights(productRights.concat(rights));
                    ctx.body = new MsgRes(true, '登录成功！', {user: user, rights: treeRights});
                } else {
                    ctx.body = new MsgRes(false, '用户名或密码错误！');
                }
            })(ctx, () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
        }else {
            ctx.body = new MsgRes(false, '验证码错误！');
        }
    });

    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/site/logined', (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Site) {
            ctx.body = new MsgRes(true);
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/site/auth/*',(ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Site) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 退出登录 */
    siteAuth.get('/logout', (ctx: Context) => {
        ctx.logout();
        ctx.body = new MsgRes(true, '退出登录');
    });

    /* 管理员信息 */
    siteAuth.get('/admin/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findById(ctx.params.id));
    });

    siteAuth.post('/adminInfo/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.updateContact(ctx.request.body));
    });

    siteAuth.post('/compare/pass', async (ctx: Context) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    siteAuth.post('/change/pass', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.changePass({
            user: ctx.state.user,
            ...ctx.request.body
        }));
    });

    /* 订单管理 */
    siteAuth.get('/orders/:productId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.findSiteOrdersByProductId(ctx.params.productId, ctx.state.user.site.id));
    });

    /* 资金管理 */
    // 在线充值
    siteAuth.get('/recharge/code', async (ctx: Context) => {
        let info = {
            type: RechargeType.Site,
            userSite: ctx.state.user,
            site: ctx.state.user.site,
        };
        ctx.body = new MsgRes(true, '', await CRechargeCode.getOne(info));
    });

    siteAuth.post('/alipayId/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.findByAlipayId(ctx.request.body));
    });

    siteAuth.post('/recharge/add', async (ctx: Context) => {
        let info:any= ctx.request.body;
        let userSite = ctx.state.user;
        let params = {
            alipayId: info.alipayId,
            type: RechargeType.Site,
            way: RechargeWay.Hand,
            user: null,
            userSite: userSite,
            site: userSite.site
        };
        ctx.body = new MsgRes(true, '', await CRecharge.addOrRecharge(params));
    });

    // 充值记录
    siteAuth.get('/recharge/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.siteAll(ctx.state.user.site.id));
    });

    // 获取用户可提现金额
    siteAuth.get('/user/funds', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', ctx.state.user.site.funds);
    });

    // 申请提现
    siteAuth.post('/withdraw/add', async (ctx: Context) => {
        let info:any = ctx.request.body;
        let userSite = ctx.state.user;
        let params = {
            alipayCount: info.alipayCount,
            alipayName: info.alipayName,
            funds: info.funds,
            type: WithdrawType.Site,
            user: undefined,
            userSite: userSite,
            site: userSite.site
        };
        ctx.body = new MsgRes(true, '', await CWithdraw.add(params));
    });

    // 提现记录
    siteAuth.get('/withdraw/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.siteAll(ctx.state.user.site.id));
    });

    /* 商品类别管理 */
    siteAuth.get('/product/types', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.getAll(ctx.state.user.site.id));
    });

    siteAuth.post('/product/type/set/onsale', async (ctx: Context) => {
        let type = await CProductTypeSite.setOnSale(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());

        ctx.body = new MsgRes(true, '', null);
    });

    siteAuth.get('/product/type/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.findByName(ctx.params.name));
    });

    siteAuth.post('/product/type/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.add(ctx.request.body, ctx.state.user.site, (ctx as any).io));
    });

    siteAuth.post('/product/type/update', async (ctx: Context) => {
        let type = await CProductTypeSite.update(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());

        ctx.body = new MsgRes(true, '', null);
    });

    /* 商品管理 */
    siteAuth.get('/products', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.getAll(ctx.state.user.site.id));
    });

    siteAuth.post('/product/set/onsale', async (ctx: Context) => {
        let product = await CProductSite.setOnSale(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
        ctx.body = new MsgRes(true, '', null);
    });

    siteAuth.get('/:typeId/product/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.findByNameAndTypeId(ctx.params.typeId, ctx.params.name));
    });

    siteAuth.get('/product/fields', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductField.getAll());
    });

    siteAuth.get('/prototype/of/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.getPrototypeById(ctx.params.id));
    });

    siteAuth.post('/product/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.add(ctx.request.body, ctx.state.user.site, (ctx as any).io));
    });

    siteAuth.post('/product/update', async (ctx: Context) => {
        let product = await CProductSite.update(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
        ctx.body = new MsgRes(true, '', product);
    });

    siteAuth.post('/product/update/platform', async (ctx: Context) => {
        let product = await CProductSite.updatePlatform(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
        ctx.body = new MsgRes(true, '', null);
    });

    /* 平台管理员角色操作 */
    siteAuth.get('/role/view/rights', async (ctx: Context) => {
        let productRights = await CProductTypeSite.productsRight(ctx.state.user.site.id);
        let rights = await RightSite.findTrees();
        ctx.body = new MsgRes(true, '', productRights.concat(rights));
    });

    siteAuth.get('/admin/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.allRoles(ctx.state.user.site.id));
    });

    siteAuth.get('/role/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.findByName(ctx.params.name));
    });

    siteAuth.post('/role/save', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserSite.saveOne(ctx.request.body, ctx.state.user.site));
    });

    siteAuth.post('/role/update', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserSite.update(ctx.request.body, (ctx as any).io));
    });

    siteAuth.get('/role/remove/:id', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserSite.delById(ctx.params.id));
    });

    /* 平台管理员操作 */
    siteAuth.get('/admins', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.allAdmins(ctx.state.user.site.id));
    });

    siteAuth.get('/admin/roles/type/user', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.typeUserRoles(ctx.state.user.site.id));
    });

    siteAuth.get('/admin/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findByUsername(ctx.params.username))
    });

    siteAuth.post('/admin/save', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.save(ctx.request.body, ctx.state.user.site));
    });

    siteAuth.post('/admin/change/role', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.changeRole(ctx.request.body, (ctx as any).io));
    });

    siteAuth.post('/admin/change/state', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.changeState(ctx.request.body, (ctx as any).io));
    });

    siteAuth.get('/admin/del/:id', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.delById(ctx.params.id));
    });

    /* 平台用户角色操作 */
    siteAuth.get('/user/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.show());
    });

    siteAuth.get('/user/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUser.allRoles(ctx.state.user.site.id));
    });

    siteAuth.post('/user/role/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUser.update(ctx.request.body, (ctx as any).io));
    });

    /* 平台用户操作 */
    siteAuth.get('/users', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.siteAll(ctx.state.user.site.id));
    });

    siteAuth.get('/user/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findByNameAndSiteId(ctx.params.username, ctx.state.user.site.id))
    });

    siteAuth.post('/user/save', async (ctx: Context) => {
        let info:any = ctx.request.body;
        info.role = await CRoleUser.findById(info.role);
        info.site = ctx.state.user.site;
        ctx.body = new MsgRes(true, '', await CUser.save(info));
    });

    siteAuth.post('/user/change/state', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.changeState(ctx.request.body, (ctx as any).io));
    });

    siteAuth.post('/user/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.update(ctx.request.body, (ctx as any).io));
    });

    /* 平台公告管理 */
    siteAuth.get('/placards', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.getSiteAll(ctx.state.user.site.id));
    });

    siteAuth.post('/placard/add', async (ctx: Context) => {
        let user = ctx.state.user;
        let info:any = ctx.request.body;
        info.user = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await CPlacardUser.add(info));
    });

    siteAuth.post('/placard/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.update(ctx.request.body));
    });

    siteAuth.get('/placard/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.delById(ctx.params.id));
    });

    /* 平台问题反馈 */
    siteAuth.get('/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.getSiteAll(ctx.state.user.site.id));
    });

    siteAuth.post('/feedback/add', async (ctx: Context) => {
        let user = ctx.state.user;
        let info:any = ctx.request.body;
        info.user = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.add(info));
    });

    siteAuth.post('/feedback/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.update(ctx.request.body));
    });

    siteAuth.get('/feedback/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.delById(ctx.params.id));
    });

    /* 处理用户问题反馈 */
    siteAuth.get('/user/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.siteGetAll(ctx.state.user.site.id));
    });

    siteAuth.post('/user/feedback/deal', async (ctx: Context) => {
        let info: any = ctx.request.body;
        info.dealTime = now();
        info.dealUser = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.deal(info));
    });

    /* 分站信息管理 */
    siteAuth.get('/site/info', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.findById(ctx.state.user.site.id));
    });

    siteAuth.post('/site/info/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.updateInfo(ctx.request.body));
    });


    router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
}
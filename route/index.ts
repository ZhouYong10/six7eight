import {Context} from "koa";
import * as Router from "koa-router";
import svgCaptcha = require("svg-captcha");
import * as debuger from "debug";
import {MsgRes} from "../utils";
import {userRoutes} from "./user";
import {platformRoute} from "./platform";
import {siteRoute} from "./site";

const debug = debuger('six7eight:route_index');

export async function appRoutes(router:Router) {

    /* 验证码 */
    router.get('/security/code', async (ctx: Context) => {
        let captcha = svgCaptcha.create({
            width: 106,
            height: 40,
            fontSize: 50
        });
        ctx.session!.captcha = captcha.text.toLowerCase();
        ctx.body = new MsgRes(true, '', captcha.data);
    });

    router.get('/', async (ctx: Context) => {
        await ctx.render('siteFront');
    });

    router.get('/admin', async (ctx: Context) => {
        await ctx.render('siteEnd');
    });

    router.get('/platform', async (ctx: Context) => {
        await ctx.render('platform');
    });

    router.get('/yzf/auto/recharge', async (ctx: Context) => {
        let info = ctx.query;
        console.log(info, ' =======================');
        if(info.key === 'chong@zhi@3.141592653'){

        }else{
            ctx.body = '你是假冒的充值记录，别以为我真的不知道! 等着被查水表吧!';
        }
    });

    userRoutes(router);
    siteRoute(router);
    platformRoute(router);
}
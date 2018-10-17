import {Context} from "koa";
import * as Router from "koa-router";
import svgCaptcha = require("svg-captcha");
import * as debuger from "debug";

const debug = debuger('six7eight:route_index');

import {MsgRes} from "../utils";
import {userRoutes} from "./user";
import {platformRoute} from "./platform";
import {siteRoute} from "./site";

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

    userRoutes(router);
    siteRoute(router);
    platformRoute(router);
}
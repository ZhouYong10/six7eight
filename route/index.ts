import {Context} from "koa";
import * as Router from "koa-router";
import passport = require("koa-passport");
import * as debuger from "debug";

const debug = debuger('six7eight:route_index');

import {authenticated} from "../utils";
import {userRoutes} from "./user";
import {platformRoute} from "./platform";
import {siteRoute} from "./site";

export async function appRoutes(router:Router) {

    router.get('/', async (ctx: Context) => {
        debug(JSON.stringify(ctx.session));
        ctx.session!.index = 'this is index';
        await ctx.render('login');
    });

    router.post('/custom', async (ctx: Context) => {
        debug(JSON.stringify(ctx.session));
        debug('parameter: ' + JSON.stringify(ctx.request.body));
        return passport.authenticate('local', (err: any, user: any, info: any, status: any) => {
            debug('/custom err: ' + err);
            debug('/custom user: ' + JSON.stringify(user));
            debug('/custom info: ' + JSON.stringify(info));
            debug('/custom status: ' + status);
            if (user === false) {
                ctx.body = {success: false};
                ctx.throw(401);
            } else {
                ctx.body = {success: true};
                return ctx.login(user)
            }
        })(ctx, () => {
            return new Promise((resolve, reject) => {
                debug('/custom 这是干什么的？？？？？');
                resolve();
            });
        });
    });

    router.post('/login',
        passport.authenticate('local', {
            successRedirect: '/app',
            failureRedirect: '/'
        })
    );

    router.get('/logout', authenticated(async (ctx: Context) => {
        ctx.logout();
        ctx.redirect('/');
    }));

    router.get('/app', authenticated(async (ctx: Context) => {
        ctx.type = 'html';
        await ctx.render('app');
    }));



    userRoutes(router);
    siteRoute(router);
    platformRoute(router);
}
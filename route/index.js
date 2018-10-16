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
const passport = require("koa-passport");
const svgCaptcha = require("svg-captcha");
const debuger = require("debug");
const debug = debuger('six7eight:route_index');
const utils_1 = require("../utils");
const user_1 = require("./user");
const platform_1 = require("./platform");
const site_1 = require("./site");
function appRoutes(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.get('/security/code', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let captcha = svgCaptcha.create({
                width: 106,
                height: 40,
                fontSize: 50
            });
            ctx.session.captcha = captcha.text.toLowerCase();
            ctx.body = new utils_1.MsgRes(true, '', captcha.data);
        }));
        router.get('/', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('login');
        }));
        router.post('/custom', (ctx) => __awaiter(this, void 0, void 0, function* () {
            debug(JSON.stringify(ctx.session));
            debug('parameter: ' + JSON.stringify(ctx.request.body));
            return passport.authenticate('local', (err, user, info, status) => {
                debug('/custom err: ' + err);
                debug('/custom user: ' + JSON.stringify(user));
                debug('/custom info: ' + JSON.stringify(info));
                debug('/custom status: ' + status);
                if (user === false) {
                    ctx.body = { success: false };
                    ctx.throw(401);
                }
                else {
                    ctx.body = { success: true };
                    return ctx.login(user);
                }
            })(ctx, () => {
                return new Promise((resolve, reject) => {
                    debug('/custom 这是干什么的？？？？？');
                    resolve();
                });
            });
        }));
        router.post('/login', passport.authenticate('local', {
            successRedirect: '/app',
            failureRedirect: '/'
        }));
        router.get('/logout', utils_1.authenticated((ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.logout();
            ctx.redirect('/');
        })));
        router.get('/app', utils_1.authenticated((ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.type = 'html';
            yield ctx.render('app');
        })));
        user_1.userRoutes(router);
        site_1.siteRoute(router);
        platform_1.platformRoute(router);
    });
}
exports.appRoutes = appRoutes;
//# sourceMappingURL=index.js.map
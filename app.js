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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const path = require("path");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const session = require("koa-session");
const json = require("koa-json");
const views = require("koa-views");
const staticDir = require("koa-static");
const onerror = require("koa-onerror");
const passport = require("koa-passport");
const cors = require("koa2-cors");
const debuger = require("debug");
const route_1 = require("./route");
const config_1 = require("./config");
const utils_1 = require("./utils");
const debug = debuger('six7eight:app');
typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
    require('./initDataBase');
    const app = new Koa();
    const router = new Router();
    route_1.appRoutes(router);
    onerror(app);
    app.keys = ['six7eight'];
    app.use(logger())
        .use(bodyParser())
        .use(cors({
        origin: 'http://' + config_1.devConf.clientIp + ':' + config_1.devConf.clientPort,
        credentials: true
    }))
        .use(session({
        key: 'six7eight:SESSIONID',
        maxAge: 'session'
    }, app))
        .use(views(path.resolve(__dirname, './views'), {
        extension: 'html',
        map: {
            html: 'ejs'
        }
    }))
        .use(staticDir(path.resolve(__dirname, './public')))
        .use(json());
    require("./auth");
    app.use(passport.initialize())
        .use(passport.session())
        .use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (e) {
            switch (e.code) {
                case 'ER_DUP_ENTRY':
                    ctx.body = new utils_1.MsgRes(false, '数据已经存在：' + e.message + '！');
                    break;
                default:
                    ctx.body = new utils_1.MsgRes(false, '操作失败：' + e.message + '!');
            }
            debug(e);
        }
    }))
        .use(router.routes())
        .use(router.allowedMethods());
    app.use((ctx) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.status === 404) {
            yield ctx.render('404');
        }
    }));
    app.on('error', (e, ctx) => __awaiter(this, void 0, void 0, function* () {
        debug(e);
    }));
    app.listen(config_1.devConf.servePort);
    console.log("Koa application is up and running on port " + config_1.devConf.servePort);
})).catch(error => {
    debug(error);
});
//# sourceMappingURL=app.js.map
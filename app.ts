import "reflect-metadata";
import {createConnection} from "typeorm";
import path = require("path");
import Koa = require("koa");
import Router  = require("koa-router");
import bodyParser = require("koa-bodyparser");
import logger = require("koa-logger");
import session = require("koa-session");
import json = require("koa-json");
import views = require("koa-views");
import staticDir = require("koa-static");
import onerror = require("koa-onerror");
import passport= require("koa-passport");
import debuger = require("debug");

const debug = debuger('six7eight:app');

import {appRoutes} from "./route";


createConnection().then(async connection => {
    require('./initDataBase');

    const app = new Koa();
    const router = new Router();
    appRoutes(router);

    onerror(app);
    app.keys = ['six7eight'];

    app.use(logger())
        .use(bodyParser())
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
        .use(router.routes())
        .use(router.allowedMethods());

    app.use(async (ctx) => {
        if (ctx.status === 404) {
            await ctx.render('404');
        }
    });

    app.on('error', async (err, ctx) => {
        debug('error: ' + err);
    });

    app.listen(3000);
    console.log("Koa application is up and running on port 3000");
}).catch(error => {
    console.error("TypeORM connection error: " + error);
});
import "reflect-metadata";
import {createConnection} from "typeorm";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import * as logger from "koa-logger";
import {appRoutes} from "./route";

createConnection().then(async connection => {
    const app = new Koa();
    const router = new Router();
    appRoutes(router);


    app.use(logger())
        .use(bodyParser())
        .use(router.routes())
        .use(router.allowedMethods());

    app.listen(3000);

    console.log("Koa application is up and running on port 3000");
}).catch(error => {
    console.error("TypeORM connection error: " + error);
});
import * as Router from "koa-router";
import {Context} from "koa";
import {userSave} from "../controler/cUser";


export async function userRoutes(router: Router){
    router.get('/users', async (ctx: Context) => {
        var savedUser = await userSave({id: 12, name: "张三 和莉莉丝", password: "123456"});
        console.log(savedUser, '==============');
        ctx.body = JSON.stringify(savedUser);
    });
}
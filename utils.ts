import {Context} from "koa";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";

export function authenticated(todo:(ctx: Context, next?: any) => any){
    return async (ctx: Context, next?: any) => {
        if (ctx.isAuthenticated()) {
            await todo(ctx, next);
        }else{
            ctx.body = '您还没有登录，请登录后在操作！！';
        }
    }
}

export function comparePass(userPass:string, databasePass:string) {
    return bcrypt.compareSync(userPass, databasePass);
}

export function myDateFromat(date:string) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function now() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

export class MsgRes {
    successed!: boolean;
    msg?: string;
    data?: any;

    constructor(successed: boolean, msg?: string, data?: any) {
        this.successed = successed;
        this.msg = msg;
        this.data = data;
    }
}

export class LoginRes {
    isLogin!:boolean;
    msg?: string;
    data?: any;

    constructor(isLogin: boolean, msg?: string, data?:any) {
        this.isLogin = isLogin;
        this.msg = msg;
        this.data = data;
    }
}
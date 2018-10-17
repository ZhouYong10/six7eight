import * as bcrypt from "bcryptjs";
import * as moment from "moment";

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

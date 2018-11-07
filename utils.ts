import * as bcrypt from "bcryptjs";
import * as moment from "moment";
import {Decimal} from "decimal.js";

export function comparePass(userPass:string, databasePass:string) {
    return bcrypt.compareSync(userPass, databasePass);
}

export function myDateFromat(date:string) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function now() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

export function decimal(num: any) {
    return new Decimal(num);
}

export function sortRights(rights: any) {
    rights.sort((itemA: any, itemB: any) => {
        if (itemA.children.lenght > 0) {
            sortRights(itemA.children);
        }
        if (itemB.children.length > 0) {
            sortRights(itemB.children);
        }
        return itemA.num - itemB.num;
    });
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

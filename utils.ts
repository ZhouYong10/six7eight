import * as bcrypt from "bcryptjs";
import * as moment from "moment";
import {Decimal} from "decimal.js";
import * as multer from "koa-multer";
import * as fs from "fs";

let upload = multer({
    storage: multer.diskStorage({
        // 文件保存路径
        destination: (req, file, cb) => {
            let dirPath = __dirname + '/public/uploads/';
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            cb(null, dirPath);
        },
        // 修改文件名称
        filename: (req, file, cb) => {
            let fileFormat = (file.originalname).split('.');
            cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
        }
    })
});
export default upload;

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

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
    }),
    limits: {
        fileSize: 1024 * 1024 * 2,
        files: 1
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype.search('image/') != -1) {
            callback(null, true);
        }else{
            callback(new Error('只能上传图片文件！'), false);
        }
    }
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
        if (itemA.children.length > 0) {
            sortRights(itemA.children);
        }
        if (itemB.children.length > 0) {
            sortRights(itemB.children);
        }
        return itemA.num - itemB.num;
    });
}

export function productToRight(types:Array<any>, rights:Array<any>) {
    for(let i = 0; i < types.length; i++){
        let type = types[i];
        let item = type.menuRightItem();
        if (type.products && type.products.length > 0) {
            productToRight(type.products, item.children);
        }else if (type.productSites && type.productSites.length > 0) {
            productToRight(type.productSites, item.children);
        }
        rights.push(item);
    }
    return rights;
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

export function assert (condition: any, message: string) {
    if (!condition) {
        throw new Error(message)
    }
}

export function isError (err: any): boolean {
    return Object.prototype.toString.call(err).indexOf('Error') > -1
}

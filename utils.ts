import * as bcrypt from "bcryptjs";
import * as moment from "moment";
import {Decimal} from "decimal.js";
import * as multer from "koa-multer";
import * as fs from "fs";
import {CFeedbackUserSite} from "./controler/CFeedbackUserSite";
import {CWithdraw} from "./controler/CWithdraw";
import {COrderUser} from "./controler/COrderUser";
import {CFeedbackUser} from "./controler/CFeedbackUser";
import {CRecharge} from "./controler/CRecharge";
import {CErrorOrderUser} from "./controler/CErrorOrderUser";
import {FundsRecordType} from "./entity/FundsRecordBase";

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

export function today() {
    return moment().format('YYYY-MM-DD');
}

export function decimal(num: any) {
    return new Decimal(num);
}

export function orderCanAccount(order:any) {
    // 订单执行时间，加上排队时间 ，加上结算时间，要小于当前时间，该订单才能结算
    let executeTime = order.num / order.speed * 60 * 1000;
    let queueTime = order.queueTime * 60 * 60 * 1000;
    let accountTime = 0 * 60 * 60 * 1000;
    let orderTime = Date.parse(order.dealTime) + executeTime + queueTime + accountTime;
    console.log(orderTime, ' orderTime 11111111111111111111111111111')
    console.log(Date.now(), ' Date.now() 11111111111111111111111111111')
    return orderTime < Date.now();
}

export function getRecordTypes(type: string) {
    let recordTypes = [];
    switch (type) {
        case '充值':
            recordTypes = [FundsRecordType.Recharge];
            break;
        case '提现':
            recordTypes = [FundsRecordType.Withdraw];
            break;
        case '消费':
            recordTypes = [FundsRecordType.UpRole, FundsRecordType.Order];
            break;
        case '返利':
            recordTypes = [FundsRecordType.Profit];
            break;
        case '平台':
            recordTypes = [FundsRecordType.Handle];
            break;
        default:
            recordTypes = [FundsRecordType.Profit, FundsRecordType.Order, FundsRecordType.Handle,
                FundsRecordType.UpRole, FundsRecordType.Recharge, FundsRecordType.Withdraw];
            break;
    }
    return recordTypes;
}

export function sortRights(rights: any) {
    rights.sort((itemA: any, itemB: any) => {
        if (itemA.children && itemA.children.length > 0) {
            sortRights(itemA.children);
        }
        if (itemB.children && itemB.children.length > 0) {
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

export function getMyProducts(menus: Array<any>) {
    let productTypes: Array<string> = [];
    let products: Array<string> = [];
    menus.forEach((type: any) => {
        if (type.type === 'productType') {
            productTypes.push(type.id);
            if (type.children.length > 0) {
                type.children.forEach((product: any) => {
                    products.push(product.id);
                });
            }
        }
    });
    return {productTypes: productTypes, products: products};
}

export function getPermission(tree: Array<any>, permissions: string[]) {
    tree.forEach((right) => {
        permissions.push(right.fingerprint);
        if (right.children && right.children.length > 0) {
            getPermission(right.children, permissions);
        }
    });
}

export async function platformGetMenuWaitCount(menus: Array<any>, roleProducts: Array<string>) {
    for(let i = 0; i < menus.length; i++){
        let item = menus[i];
        item.waitCount = 0;
        if (item.type === 'productType') {
            let products = item.children;
            for(let i = 0; i < products.length; i++){
                let product = products[i];
                product.waitCount = await COrderUser.getWaitCount(product.id);
                item.waitCount += product.waitCount;
            }
        }
        switch (item.fingerprint) {
            case 'orderErrorPlatform':
                item.waitCount = await CErrorOrderUser.getWaitCount(roleProducts);
                break;
            case 'rechargesPlatform':
                item.waitCount = await CRecharge.getWaitCount();
                break;
            case 'withdrawsPlatform':
                item.waitCount = await CWithdraw.getWaitCount();
                break;
            case 'feedbackSitePlatform':
                item.waitCount = await CFeedbackUserSite.getWaitCount();
                break;
            case 'feedbackUserPlatform':
                item.waitCount = await CFeedbackUser.getWaitCount();
                break;
        }
        if (item.type === 'menuGroup') {
            let menuItems = item.children;
            for(let i = 0; i < menuItems.length; i++){
                let menuItem = menuItems[i];
                menuItem.waitCount = 0;
                switch (menuItem.fingerprint) {
                    case 'orderErrorPlatform':
                        menuItem.waitCount = await CErrorOrderUser.getWaitCount(roleProducts);
                        item.waitCount += menuItem.waitCount;
                        break;
                    case 'rechargesPlatform':
                        menuItem.waitCount = await CRecharge.getWaitCount();
                        item.waitCount += menuItem.waitCount;
                        break;
                    case 'withdrawsPlatform':
                        menuItem.waitCount = await CWithdraw.getWaitCount();
                        item.waitCount += menuItem.waitCount;
                        break;
                    case 'feedbackSitePlatform':
                        menuItem.waitCount = await CFeedbackUserSite.getWaitCount();
                        item.waitCount += menuItem.waitCount;
                        break;
                    case 'feedbackUserPlatform':
                        menuItem.waitCount = await CFeedbackUser.getWaitCount();
                        item.waitCount += menuItem.waitCount;
                        break;
                }
            }
        }
    }
}

export async function siteGetMenuWaitCount(menus: Array<any>, siteId: string, productIds: Array<string>) {
    for(let i = 0; i < menus.length; i++){
        let item = menus[i];
        item.waitCount = 0;
        if (item.type === 'productType') {
            let products = item.children;
            for(let i = 0; i < products.length; i++){
                let product = products[i];
                product.waitCount = await COrderUser.getSiteWaitCount(product.id);
                item.waitCount += product.waitCount;
            }
        }
        switch (item.fingerprint) {
            case 'orderErrorSite':
                item.waitCount = await CErrorOrderUser.getSiteWaitCount(productIds);
                break;
            case 'feedbackUserSite':
                item.waitCount = await CFeedbackUser.getSiteWaitCount(siteId);
                break;
        }
        if (item.type === 'menuGroup') {
            let menuItems = item.children;
            for(let i = 0; i < menuItems.length; i++){
                let menuItem = menuItems[i];
                menuItem.waitCount = 0;
                switch (menuItem.fingerprint) {
                    case 'orderErrorSite':
                        menuItem.waitCount = await CErrorOrderUser.getSiteWaitCount(productIds);
                        item.waitCount += menuItem.waitCount;
                        break;
                    case 'feedbackUserSite':
                        menuItem.waitCount = await CFeedbackUser.getSiteWaitCount(siteId);
                        item.waitCount += menuItem.waitCount;
                        break;
                }
            }
        }
    }
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

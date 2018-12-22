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
const bcrypt = require("bcryptjs");
const moment = require("moment");
const decimal_js_1 = require("decimal.js");
const multer = require("koa-multer");
const fs = require("fs");
const CFeedbackUserSite_1 = require("./controler/CFeedbackUserSite");
const CWithdraw_1 = require("./controler/CWithdraw");
const COrderUser_1 = require("./controler/COrderUser");
const CFeedbackUser_1 = require("./controler/CFeedbackUser");
const CRecharge_1 = require("./controler/CRecharge");
const CErrorOrderUser_1 = require("./controler/CErrorOrderUser");
let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            let dirPath = __dirname + '/public/uploads/';
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            cb(null, dirPath);
        },
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
        }
        else {
            callback(new Error('只能上传图片文件！'), false);
        }
    }
});
exports.default = upload;
function comparePass(userPass, databasePass) {
    return bcrypt.compareSync(userPass, databasePass);
}
exports.comparePass = comparePass;
function myDateFromat(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
exports.myDateFromat = myDateFromat;
function now() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}
exports.now = now;
function decimal(num) {
    return new decimal_js_1.Decimal(num);
}
exports.decimal = decimal;
function sortRights(rights) {
    rights.sort((itemA, itemB) => {
        if (itemA.children && itemA.children.length > 0) {
            sortRights(itemA.children);
        }
        if (itemB.children && itemB.children.length > 0) {
            sortRights(itemB.children);
        }
        return itemA.num - itemB.num;
    });
}
exports.sortRights = sortRights;
function productToRight(types, rights) {
    for (let i = 0; i < types.length; i++) {
        let type = types[i];
        let item = type.menuRightItem();
        if (type.products && type.products.length > 0) {
            productToRight(type.products, item.children);
        }
        else if (type.productSites && type.productSites.length > 0) {
            productToRight(type.productSites, item.children);
        }
        rights.push(item);
    }
    return rights;
}
exports.productToRight = productToRight;
function getMyProducts(menus) {
    let productTypes = [];
    let products = [];
    menus.forEach((type) => {
        if (type.type === 'productType') {
            productTypes.push(type.id);
            if (type.children.length > 0) {
                type.children.forEach((product) => {
                    products.push(product.id);
                });
            }
        }
    });
    return { productTypes: productTypes, products: products };
}
exports.getMyProducts = getMyProducts;
function getPermission(tree, permissions) {
    tree.forEach((right) => {
        permissions.push(right.fingerprint);
        if (right.children && right.children.length > 0) {
            getPermission(right.children, permissions);
        }
    });
}
exports.getPermission = getPermission;
function platformGetMenuWaitCount(menus, roleProducts) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < menus.length; i++) {
            let item = menus[i];
            item.waitCount = 0;
            if (item.type === 'productType') {
                let products = item.children;
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    product.waitCount = yield COrderUser_1.COrderUser.getWaitCount(product.id);
                    item.waitCount += product.waitCount;
                }
            }
            switch (item.fingerprint) {
                case 'orderErrorPlatform':
                    item.waitCount = yield CErrorOrderUser_1.CErrorOrderUser.getWaitCount(roleProducts);
                    break;
                case 'rechargesPlatform':
                    item.waitCount = yield CRecharge_1.CRecharge.getWaitCount();
                    break;
                case 'withdrawsPlatform':
                    item.waitCount = yield CWithdraw_1.CWithdraw.getWaitCount();
                    break;
                case 'feedbackSitePlatform':
                    item.waitCount = yield CFeedbackUserSite_1.CFeedbackUserSite.getWaitCount();
                    break;
                case 'feedbackUserPlatform':
                    item.waitCount = yield CFeedbackUser_1.CFeedbackUser.getWaitCount();
                    break;
            }
            if (item.type === 'menuGroup') {
                let menuItems = item.children;
                for (let i = 0; i < menuItems.length; i++) {
                    let menuItem = menuItems[i];
                    menuItem.waitCount = 0;
                    switch (menuItem.fingerprint) {
                        case 'orderErrorPlatform':
                            menuItem.waitCount = yield CErrorOrderUser_1.CErrorOrderUser.getWaitCount(roleProducts);
                            item.waitCount += menuItem.waitCount;
                            break;
                        case 'rechargesPlatform':
                            menuItem.waitCount = yield CRecharge_1.CRecharge.getWaitCount();
                            item.waitCount += menuItem.waitCount;
                            break;
                        case 'withdrawsPlatform':
                            menuItem.waitCount = yield CWithdraw_1.CWithdraw.getWaitCount();
                            item.waitCount += menuItem.waitCount;
                            break;
                        case 'feedbackSitePlatform':
                            menuItem.waitCount = yield CFeedbackUserSite_1.CFeedbackUserSite.getWaitCount();
                            item.waitCount += menuItem.waitCount;
                            break;
                        case 'feedbackUserPlatform':
                            menuItem.waitCount = yield CFeedbackUser_1.CFeedbackUser.getWaitCount();
                            item.waitCount += menuItem.waitCount;
                            break;
                    }
                }
            }
        }
    });
}
exports.platformGetMenuWaitCount = platformGetMenuWaitCount;
function siteGetMenuWaitCount(menus, user) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < menus.length; i++) {
            let item = menus[i];
            item.waitCount = 0;
            if (item.type === 'productType') {
                let products = item.children;
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    product.waitCount = yield COrderUser_1.COrderUser.getSiteWaitCount(product.id);
                    item.waitCount += product.waitCount;
                }
            }
            switch (item.fingerprint) {
                case 'orderErrorSite':
                    item.waitCount = yield CErrorOrderUser_1.CErrorOrderUser.getSiteWaitCount(user.role.products);
                    break;
                case 'feedbackUserSite':
                    item.waitCount = yield CFeedbackUser_1.CFeedbackUser.getSiteWaitCount(user.site.id);
                    break;
            }
            if (item.type === 'menuGroup') {
                let menuItems = item.children;
                for (let i = 0; i < menuItems.length; i++) {
                    let menuItem = menuItems[i];
                    menuItem.waitCount = 0;
                    switch (menuItem.fingerprint) {
                        case 'orderErrorSite':
                            menuItem.waitCount = yield CErrorOrderUser_1.CErrorOrderUser.getSiteWaitCount(user.role.products);
                            item.waitCount += menuItem.waitCount;
                            break;
                        case 'feedbackUserSite':
                            menuItem.waitCount = yield CFeedbackUser_1.CFeedbackUser.getSiteWaitCount(user.site.id);
                            item.waitCount += menuItem.waitCount;
                            break;
                    }
                }
            }
        }
    });
}
exports.siteGetMenuWaitCount = siteGetMenuWaitCount;
class MsgRes {
    constructor(successed, msg, data) {
        this.successed = successed;
        this.msg = msg;
        this.data = data;
    }
}
exports.MsgRes = MsgRes;
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
exports.assert = assert;
function isError(err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1;
}
exports.isError = isError;
//# sourceMappingURL=utils.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const moment = require("moment");
const decimal_js_1 = require("decimal.js");
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
    console.log('----------------------------');
    rights.sort((itemA, itemB) => {
        if (itemA.children.lenght > 0) {
            sortRights(itemA.children);
        }
        if (itemB.children.length > 0) {
            sortRights(itemB.children);
        }
        console.log(itemA.num, ' === Date.parse(itemA.createTime)');
        console.log(itemB.num, ' === Date.parse(itemB.createTime)');
        console.log(itemA.num - itemB.num, ' === Date.parse(itemB.createTime)');
        return itemA.num - itemB.num;
    });
}
exports.sortRights = sortRights;
class MsgRes {
    constructor(successed, msg, data) {
        this.successed = successed;
        this.msg = msg;
        this.data = data;
    }
}
exports.MsgRes = MsgRes;
//# sourceMappingURL=utils.js.map
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
class MsgRes {
    constructor(successed, msg, data) {
        this.successed = successed;
        this.msg = msg;
        this.data = data;
    }
}
exports.MsgRes = MsgRes;
//# sourceMappingURL=utils.js.map
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
const Withdraw_1 = require("../entity/Withdraw");
const utils_1 = require("../utils");
class CWithdraw {
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { alipayCount, alipayName, funds, type, user, userSite, site } = info;
            let oldFunds, newFunds;
            if (type === Withdraw_1.WithdrawType.User) {
                oldFunds = user.funds;
                newFunds = parseFloat(utils_1.decimal(oldFunds).minus(funds).toFixed(4));
            }
            else if (type === Withdraw_1.WithdrawType.Site) {
                oldFunds = site.funds;
                newFunds = parseFloat(utils_1.decimal(oldFunds).minus(funds).toFixed(4));
            }
            let withdraw = new Withdraw_1.Withdraw();
            withdraw.alipayCount = alipayCount;
            withdraw.alipayName = alipayName;
            withdraw.funds = funds;
            withdraw.oldFunds = oldFunds;
            withdraw.newFunds = newFunds;
            withdraw.type = type;
            withdraw.user = user;
            withdraw.userSite = userSite;
            withdraw.site = site;
        });
    }
}
exports.CWithdraw = CWithdraw;
//# sourceMappingURL=CWithdraw.js.map
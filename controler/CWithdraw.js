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
const User_1 = require("../entity/User");
const Site_1 = require("../entity/Site");
const typeorm_1 = require("typeorm");
class CWithdraw {
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { alipayCount, alipayName, funds, type, user, userSite, site } = info;
            let withdraw = new Withdraw_1.Withdraw();
            withdraw.alipayCount = alipayCount;
            withdraw.alipayName = alipayName;
            withdraw.funds = funds;
            withdraw.type = type;
            withdraw.user = user;
            withdraw.userSite = userSite;
            withdraw.site = site;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                if (type === Withdraw_1.WithdrawType.User) {
                    withdraw.oldFunds = user.funds;
                    withdraw.newFunds = parseFloat(utils_1.decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                    yield tem.update(User_1.User, user.id, {
                        funds: withdraw.newFunds,
                        freezeFunds: parseFloat(utils_1.decimal(user.freezeFunds).plus(funds).toFixed(4))
                    });
                }
                else if (type === Withdraw_1.WithdrawType.Site) {
                    withdraw.oldFunds = site.funds;
                    withdraw.newFunds = parseFloat(utils_1.decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                    yield tem.update(Site_1.Site, site.id, {
                        funds: withdraw.newFunds,
                        freezeFunds: parseFloat(utils_1.decimal(site.freezeFunds).plus(funds).toFixed(4))
                    });
                }
                yield tem.save(withdraw);
            }));
        });
    }
    static userAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.userAllRecords(userId);
        });
    }
}
exports.CWithdraw = CWithdraw;
//# sourceMappingURL=CWithdraw.js.map
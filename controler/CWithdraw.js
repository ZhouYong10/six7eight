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
    static add(info, io) {
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
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let freezeFunds;
                if (type === Withdraw_1.WithdrawType.User) {
                    utils_1.assert(user.funds > funds, '账户余额不足!');
                    withdraw.oldFunds = user.funds;
                    withdraw.newFunds = parseFloat(utils_1.decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                    freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).plus(funds).toFixed(4));
                    yield tem.update(User_1.User, user.id, {
                        funds: withdraw.newFunds,
                        freezeFunds: freezeFunds
                    });
                }
                else if (type === Withdraw_1.WithdrawType.Site) {
                    utils_1.assert(site.funds > funds, '站点余额不足！');
                    withdraw.oldFunds = site.funds;
                    withdraw.newFunds = parseFloat(utils_1.decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                    freezeFunds = parseFloat(utils_1.decimal(site.freezeFunds).plus(funds).toFixed(4));
                    yield tem.update(Site_1.Site, site.id, {
                        funds: withdraw.newFunds,
                        freezeFunds: freezeFunds
                    });
                }
                withdraw = yield tem.save(withdraw);
                io.emit('platformWithdrawAdd', withdraw);
                return { withdraw: withdraw, freezeFunds: freezeFunds };
            }));
        });
    }
    static userAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.userAllRecords(userId);
        });
    }
    static siteAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.siteAllRecords(siteId);
        });
    }
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.all();
        });
    }
    static handWithdraw(withdrawId) {
        return __awaiter(this, void 0, void 0, function* () {
            let withdraw = yield Withdraw_1.Withdraw.findByIdWithUserAndSite(withdrawId);
            withdraw.dealTime = utils_1.now();
            withdraw.state = Withdraw_1.WithdrawState.Success;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let type = withdraw.type;
                if (type === Withdraw_1.WithdrawType.User) {
                    let user = withdraw.user;
                    yield tem.update(User_1.User, user.id, {
                        freezeFunds: parseFloat(utils_1.decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4))
                    });
                }
                else if (type === Withdraw_1.WithdrawType.Site) {
                    let site = withdraw.site;
                    yield tem.update(Site_1.Site, site.id, {
                        freezeFunds: parseFloat(utils_1.decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4))
                    });
                }
                withdraw = yield tem.save(withdraw);
            }));
            return withdraw;
        });
    }
    static handWithdrawFail(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, failMsg } = info;
            let withdraw = yield Withdraw_1.Withdraw.findByIdWithUserAndSite(id);
            withdraw.dealTime = utils_1.now();
            withdraw.failMsg = failMsg;
            withdraw.state = Withdraw_1.WithdrawState.Fail;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let type = withdraw.type;
                if (type === Withdraw_1.WithdrawType.User) {
                    let user = withdraw.user;
                    yield tem.update(User_1.User, user.id, {
                        funds: parseFloat(utils_1.decimal(user.funds).plus(withdraw.funds).toFixed(4)),
                        freezeFunds: parseFloat(utils_1.decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4))
                    });
                }
                else if (type === Withdraw_1.WithdrawType.Site) {
                    let site = withdraw.site;
                    yield tem.update(Site_1.Site, site.id, {
                        funds: parseFloat(utils_1.decimal(site.funds).plus(withdraw.funds).toFixed(4)),
                        freezeFunds: parseFloat(utils_1.decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4))
                    });
                }
                withdraw = yield tem.save(withdraw);
            }));
            return withdraw;
        });
    }
}
exports.CWithdraw = CWithdraw;
//# sourceMappingURL=CWithdraw.js.map
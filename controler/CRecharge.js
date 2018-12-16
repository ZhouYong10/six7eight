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
const Recharge_1 = require("../entity/Recharge");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const Site_1 = require("../entity/Site");
const utils_1 = require("../utils");
const FundsRecordUser_1 = require("../entity/FundsRecordUser");
const FundsRecordBase_1 = require("../entity/FundsRecordBase");
const FundsRecordSite_1 = require("../entity/FundsRecordSite");
class CRecharge {
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.getWaitCount();
        });
    }
    static findByAlipayId(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.findHandCommited(info.alipayId);
        });
    }
    static addOrRecharge(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { alipayId, type, way, user, userSite, site } = info;
            let recharge = yield Recharge_1.Recharge.findAutoCommited(alipayId);
            if (recharge) {
                if (type === Recharge_1.RechargeType.User) {
                    yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                        let userNewFunds = parseFloat(utils_1.decimal(recharge.funds).plus(user.funds).toFixed(4));
                        recharge.intoAccountTime = utils_1.now();
                        recharge.oldFunds = user.funds;
                        recharge.newFunds = userNewFunds;
                        recharge.state = Recharge_1.RechargeState.Success;
                        recharge.type = type;
                        recharge.user = user;
                        recharge.site = site;
                        recharge = yield tem.save(recharge);
                        yield tem.update(User_1.User, user.id, { funds: userNewFunds });
                    }));
                }
                else if (type === Recharge_1.RechargeType.Site) {
                    yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                        let siteNewFunds = parseFloat(utils_1.decimal(recharge.funds).plus(site.funds).toFixed(4));
                        recharge.intoAccountTime = utils_1.now();
                        recharge.oldFunds = site.funds;
                        recharge.newFunds = siteNewFunds;
                        recharge.state = Recharge_1.RechargeState.Success;
                        recharge.type = type;
                        recharge.userSite = userSite;
                        recharge.site = site;
                        recharge = yield tem.save(recharge);
                        yield tem.update(Site_1.Site, site.id, { funds: siteNewFunds });
                    }));
                }
            }
            else {
                recharge = new Recharge_1.Recharge();
                recharge.alipayId = alipayId;
                recharge.type = type;
                recharge.way = way;
                recharge.user = user;
                recharge.userSite = userSite;
                recharge.site = site;
                recharge = yield recharge.save();
                io.emit('plusBadge', 'rechargesPlatform');
            }
            io.emit('platformRechargeAdd', recharge);
            return recharge;
        });
    }
    static handRecharge(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, funds } = info;
            let recharge = yield Recharge_1.Recharge.findById(id);
            let type = recharge.type;
            let user = recharge.user;
            let site = recharge.site;
            if (type === Recharge_1.RechargeType.User) {
                yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                    let userNewFunds = parseFloat(utils_1.decimal(funds).plus(user.funds).toFixed(4));
                    recharge.intoAccountTime = utils_1.now();
                    recharge.funds = funds;
                    recharge.oldFunds = user.funds;
                    recharge.newFunds = userNewFunds;
                    recharge.state = Recharge_1.RechargeState.Success;
                    recharge = yield tem.save(recharge);
                    yield tem.update(User_1.User, user.id, { funds: userNewFunds });
                    let fundsRecord = new FundsRecordUser_1.FundsRecordUser();
                    fundsRecord.oldFunds = user.funds;
                    fundsRecord.funds = funds;
                    fundsRecord.newFunds = userNewFunds;
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                    fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                    fundsRecord.description = '账户充值： ￥ ' + funds;
                    fundsRecord.user = user;
                    yield tem.save(fundsRecord);
                    io.emit(user.id + 'changeFunds', userNewFunds);
                    io.emit('platformRechargeDeal', recharge);
                    io.emit('minusBadge', 'rechargesPlatform');
                }));
            }
            else if (type === Recharge_1.RechargeType.Site) {
                return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                    let siteNewFunds = parseFloat(utils_1.decimal(funds).plus(site.funds).toFixed(4));
                    recharge.intoAccountTime = utils_1.now();
                    recharge.funds = funds;
                    recharge.oldFunds = site.funds;
                    recharge.newFunds = siteNewFunds;
                    recharge.state = Recharge_1.RechargeState.Success;
                    recharge = yield tem.save(recharge);
                    yield tem.update(Site_1.Site, site.id, { funds: siteNewFunds });
                    let userSite = recharge.userSite;
                    let fundsRecord = new FundsRecordSite_1.FundsRecordSite();
                    fundsRecord.oldFunds = site.funds;
                    fundsRecord.funds = funds;
                    fundsRecord.newFunds = siteNewFunds;
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                    fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                    fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + funds;
                    fundsRecord.site = site;
                    fundsRecord.userSite = recharge.userSite;
                    yield tem.save(fundsRecord);
                    io.emit(site.id + 'changeFunds', siteNewFunds);
                    io.emit('minusBadge', 'rechargesPlatform');
                    io.emit('platformRechargeDeal', recharge);
                }));
            }
        });
    }
    static handRechargeFail(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, failMsg } = info;
            let recharge = yield Recharge_1.Recharge.findByIdOnlyRecharge(id);
            recharge.intoAccountTime = utils_1.now();
            recharge.failMsg = failMsg;
            recharge.state = Recharge_1.RechargeState.Fail;
            recharge = yield recharge.save();
            io.emit('minusBadge', 'rechargesPlatform');
            io.emit('platformRechargeFail', recharge);
        });
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.all(page);
        });
    }
    static userAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.userAllRecords(userId);
        });
    }
    static siteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.siteAllRecords(siteId, page);
        });
    }
}
exports.CRecharge = CRecharge;
//# sourceMappingURL=CRecharge.js.map
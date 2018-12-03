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
class CRecharge {
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
            }
            io.emit('platformRechargeAdd', recharge);
            return recharge;
        });
    }
    static handRecharge(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, funds } = info;
            let recharge = yield Recharge_1.Recharge.findById(id);
            let { type, user, site } = recharge;
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
                }));
            }
            else if (type === Recharge_1.RechargeType.Site) {
                yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                    let siteNewFunds = parseFloat(utils_1.decimal(funds).plus(site.funds).toFixed(4));
                    recharge.intoAccountTime = utils_1.now();
                    recharge.funds = funds;
                    recharge.oldFunds = site.funds;
                    recharge.newFunds = siteNewFunds;
                    recharge.state = Recharge_1.RechargeState.Success;
                    recharge = yield tem.save(recharge);
                    yield tem.update(Site_1.Site, site.id, { funds: siteNewFunds });
                }));
            }
            return recharge;
        });
    }
    static handRechargeFail(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, failMsg } = info;
            let recharge = yield Recharge_1.Recharge.findByIdOnlyRecharge(id);
            recharge.intoAccountTime = utils_1.now();
            recharge.failMsg = failMsg;
            recharge.state = Recharge_1.RechargeState.Fail;
            return yield recharge.save();
        });
    }
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.all();
        });
    }
    static userAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.userAllRecords(userId);
        });
    }
    static siteAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.siteAllRecords(siteId);
        });
    }
}
exports.CRecharge = CRecharge;
//# sourceMappingURL=CRecharge.js.map
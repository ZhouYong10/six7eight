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
const FundsRecordUser_1 = require("../entity/FundsRecordUser");
const FundsRecordBase_1 = require("../entity/FundsRecordBase");
const FundsRecordSite_1 = require("../entity/FundsRecordSite");
const MessageBase_1 = require("../entity/MessageBase");
const MessageUser_1 = require("../entity/MessageUser");
const MessageUserSite_1 = require("../entity/MessageUserSite");
class CWithdraw {
    static clear(day) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("开始清除" + day + "天前的提现记录");
            yield Withdraw_1.Withdraw.clearWithdraw(day);
            console.log("清除提现记录完成");
        });
    }
    static dayWithdrawOfUser(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.dayWithdrawOfUser(userId, date);
        });
    }
    static platWithdrawOfDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.platWithdrawOfDay(date);
        });
    }
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.getWaitCount();
        });
    }
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
                    withdraw.oldFunds = user.funds;
                    withdraw.newFunds = parseFloat(utils_1.decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                    freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).plus(funds).toFixed(4));
                    yield tem.update(User_1.User, user.id, {
                        funds: withdraw.newFunds,
                        freezeFunds: freezeFunds
                    });
                    let fundsRecord = new FundsRecordUser_1.FundsRecordUser();
                    fundsRecord.oldFunds = withdraw.oldFunds;
                    fundsRecord.funds = withdraw.funds;
                    fundsRecord.newFunds = withdraw.newFunds;
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                    fundsRecord.type = FundsRecordBase_1.FundsRecordType.Withdraw;
                    fundsRecord.description = '账户提现: ￥' + withdraw.funds;
                    fundsRecord.user = user;
                    yield tem.save(fundsRecord);
                }
                else if (type === Withdraw_1.WithdrawType.Site) {
                    withdraw.oldFunds = site.funds;
                    withdraw.newFunds = parseFloat(utils_1.decimal(withdraw.oldFunds).minus(funds).toFixed(4));
                    freezeFunds = parseFloat(utils_1.decimal(site.freezeFunds).plus(funds).toFixed(4));
                    yield tem.update(Site_1.Site, site.id, {
                        funds: withdraw.newFunds,
                        freezeFunds: freezeFunds
                    });
                    let fundsRecord = new FundsRecordSite_1.FundsRecordSite();
                    fundsRecord.oldFunds = withdraw.oldFunds;
                    fundsRecord.funds = withdraw.funds;
                    fundsRecord.newFunds = withdraw.newFunds;
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                    fundsRecord.type = FundsRecordBase_1.FundsRecordType.Withdraw;
                    fundsRecord.description = '站点管理员: ' + withdraw.userSite.username + ', 提现: ￥' + withdraw.funds;
                    fundsRecord.userSite = withdraw.userSite;
                    fundsRecord.site = site;
                    yield tem.save(fundsRecord);
                }
                withdraw = yield tem.save(withdraw);
                io.emit('plusBadge', 'withdrawsPlatform');
                io.emit('platformWithdrawAdd', withdraw);
                return { withdraw: withdraw, freezeFunds: freezeFunds };
            }));
        });
    }
    static userAll(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.userAllRecords(userId, page);
        });
    }
    static siteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.siteAllRecords(siteId, page);
        });
    }
    static findByIdSite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.findByIdWithUserSite(id);
        });
    }
    static findByIdUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.findByIdPlain(id);
        });
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.Withdraw.all(page);
        });
    }
    static handWithdraw(withdrawId, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let withdraw = yield Withdraw_1.Withdraw.findByIdWithUserAndSite(withdrawId);
            utils_1.assert(withdraw.state === Withdraw_1.WithdrawState.Wait, '当前提现申请已经处理了');
            withdraw.dealTime = utils_1.now();
            withdraw.state = Withdraw_1.WithdrawState.Success;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let type = withdraw.type;
                if (type === Withdraw_1.WithdrawType.User) {
                    let user = withdraw.user;
                    utils_1.assert(user.freezeFunds - withdraw.funds >= 0, '账户冻结金额不足！');
                    let freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4));
                    yield tem.update(User_1.User, user.id, {
                        freezeFunds: freezeFunds
                    });
                    io.emit(user.id + 'changeFreezeFunds', freezeFunds);
                    let message = new MessageUser_1.MessageUser();
                    message.user = user;
                    message.title = MessageBase_1.MessageTitle.Withdraw;
                    message.content = `提现: ${withdraw.funds} 元, 已到账!`;
                    message.frontUrl = '/withdraw/records';
                    message.aimId = withdraw.id;
                    yield tem.save(message);
                    io.emit(user.id + 'plusMessageNum');
                }
                else if (type === Withdraw_1.WithdrawType.Site) {
                    let site = withdraw.site;
                    utils_1.assert(site.freezeFunds - withdraw.funds >= 0, '站点冻结金额不足！');
                    let freezeFunds = parseFloat(utils_1.decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4));
                    yield tem.update(Site_1.Site, site.id, {
                        freezeFunds: freezeFunds
                    });
                    io.emit(site.id + 'changeFreezeFunds', freezeFunds);
                    let message = new MessageUserSite_1.MessageUserSite();
                    message.user = withdraw.userSite;
                    message.title = MessageBase_1.MessageTitle.Withdraw;
                    message.content = `提现: ${withdraw.funds} 元, 已到账!`;
                    message.frontUrl = '/home/withdraw/records';
                    message.aimId = withdraw.id;
                    yield tem.save(message);
                    io.emit(withdraw.userSite.id + 'plusMessageNum');
                }
                withdraw = yield tem.save(withdraw);
                io.emit('minusBadge', 'withdrawsPlatform');
                io.emit('platformWithdrawDeal', withdraw);
            }));
        });
    }
    static handWithdrawFail(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, failMsg } = info;
            let withdraw = yield Withdraw_1.Withdraw.findByIdWithUserAndSite(id);
            utils_1.assert(withdraw.state === Withdraw_1.WithdrawState.Wait, '当前提现申请已经处理了');
            withdraw.dealTime = utils_1.now();
            withdraw.failMsg = failMsg;
            withdraw.state = Withdraw_1.WithdrawState.Fail;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let type = withdraw.type;
                if (type === Withdraw_1.WithdrawType.User) {
                    let user = withdraw.user;
                    let funds = parseFloat(utils_1.decimal(user.funds).plus(withdraw.funds).toFixed(4));
                    let freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).minus(withdraw.funds).toFixed(4));
                    yield tem.update(User_1.User, user.id, {
                        funds: funds,
                        freezeFunds: freezeFunds
                    });
                    let fundsRecord = new FundsRecordUser_1.FundsRecordUser();
                    fundsRecord.oldFunds = user.funds;
                    fundsRecord.funds = withdraw.funds;
                    fundsRecord.newFunds = funds;
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                    fundsRecord.type = FundsRecordBase_1.FundsRecordType.Withdraw;
                    fundsRecord.description = '账户提现失败，退回: ￥' + withdraw.funds;
                    fundsRecord.user = user;
                    yield tem.save(fundsRecord);
                    io.emit(user.id + 'changeFundsAndFreezeFunds', { funds: funds, freezeFunds: freezeFunds });
                    let message = new MessageUser_1.MessageUser();
                    message.user = user;
                    message.title = MessageBase_1.MessageTitle.WithdrawError;
                    message.content = `提现: ${withdraw.funds} 元, 失败 -- ${withdraw.failMsg}`;
                    message.frontUrl = '/withdraw/records';
                    message.aimId = withdraw.id;
                    yield tem.save(message);
                    io.emit(user.id + 'plusMessageNum');
                }
                else if (type === Withdraw_1.WithdrawType.Site) {
                    let site = withdraw.site;
                    let funds = parseFloat(utils_1.decimal(site.funds).plus(withdraw.funds).toFixed(4));
                    let freezeFunds = parseFloat(utils_1.decimal(site.freezeFunds).minus(withdraw.funds).toFixed(4));
                    yield tem.update(Site_1.Site, site.id, {
                        funds: funds,
                        freezeFunds: freezeFunds
                    });
                    let fundsRecord = new FundsRecordSite_1.FundsRecordSite();
                    fundsRecord.oldFunds = site.funds;
                    fundsRecord.funds = withdraw.funds;
                    fundsRecord.newFunds = funds;
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                    fundsRecord.type = FundsRecordBase_1.FundsRecordType.Withdraw;
                    fundsRecord.description = '站点管理员: ' + withdraw.userSite.username + ', 提现失败，退回: ￥' + withdraw.funds;
                    fundsRecord.userSite = withdraw.userSite;
                    fundsRecord.site = site;
                    yield tem.save(fundsRecord);
                    io.emit(site.id + 'changeFundsAndFreezeFunds', { funds: funds, freezeFunds: freezeFunds });
                    let message = new MessageUserSite_1.MessageUserSite();
                    message.user = withdraw.userSite;
                    message.title = MessageBase_1.MessageTitle.WithdrawError;
                    message.content = `提现: ${withdraw.funds} 元, 失败 -- ${withdraw.failMsg}`;
                    message.frontUrl = '/home/withdraw/records';
                    message.aimId = withdraw.id;
                    yield tem.save(message);
                    io.emit(withdraw.userSite.id + 'plusMessageNum');
                }
                withdraw = yield tem.save(withdraw);
                io.emit('minusBadge', 'withdrawsPlatform');
                io.emit('platformWithdrawDeal', withdraw);
            }));
        });
    }
}
exports.CWithdraw = CWithdraw;
//# sourceMappingURL=CWithdraw.js.map
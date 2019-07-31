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
const UserSite_1 = require("../entity/UserSite");
const MessageBase_1 = require("../entity/MessageBase");
const MessageUser_1 = require("../entity/MessageUser");
const MessageUserSite_1 = require("../entity/MessageUserSite");
class CRecharge {
    static clear(day) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("开始清除" + day + "天前的充值记录");
            yield Recharge_1.Recharge.clearRecharge(day);
            console.log("清除充值记录完成");
        });
    }
    static dayRechargeOfUser(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.dayRechargeOfUser(userId, date);
        });
    }
    static platRechargeOfDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.platRechargeOfDay(date);
        });
    }
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.getWaitCount();
        });
    }
    static findByIdSite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.findById(id);
        });
    }
    static findByIdUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.findByIdOnlyRecharge(id);
        });
    }
    static findByAlipayId(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let recharge = yield Recharge_1.Recharge.findHandCommited(info.alipayId);
            return !!recharge;
        });
    }
    static yiZhiFuAutoRecharge(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let recharge = yield tem.findOne(Recharge_1.Recharge, { alipayId: info.alipayId }, { relations: ["site", "user", "userSite"] });
                if (recharge) {
                    if (recharge.way === Recharge_1.RechargeWay.Hand) {
                        if (recharge.state === Recharge_1.RechargeState.Wait) {
                            recharge.intoAccountTime = utils_1.now();
                            recharge.funds = info.money;
                            recharge.state = Recharge_1.RechargeState.Success;
                            if (recharge.type === Recharge_1.RechargeType.User) {
                                let user = recharge.user;
                                let userOldFunds = user.funds;
                                user.funds = parseFloat(utils_1.decimal(user.funds).plus(recharge.funds).toFixed(4));
                                recharge.oldFunds = userOldFunds;
                                recharge.newFunds = user.funds;
                                recharge = yield tem.save(recharge);
                                user = yield tem.save(user);
                                let fundsRecord = new FundsRecordUser_1.FundsRecordUser();
                                fundsRecord.oldFunds = userOldFunds;
                                fundsRecord.funds = recharge.funds;
                                fundsRecord.newFunds = user.funds;
                                fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                                fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                                fundsRecord.description = '账户充值： ￥ ' + info.money;
                                fundsRecord.user = user;
                                yield tem.save(fundsRecord);
                                let message = new MessageUser_1.MessageUser();
                                message.user = user;
                                message.title = MessageBase_1.MessageTitle.Recharge;
                                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                                message.frontUrl = '/recharge/records';
                                message.aimId = recharge.id;
                                yield tem.save(message);
                                io.emit(user.id + 'changeFunds', user.funds);
                                io.emit('platformRechargeDeal', recharge);
                                io.emit('minusBadge', 'rechargesPlatform');
                                io.emit(user.id + 'plusMessageNum');
                            }
                            else if (recharge.type === Recharge_1.RechargeType.Site) {
                                let site = recharge.site;
                                let siteOldFunds = site.funds;
                                site.funds = parseFloat(utils_1.decimal(recharge.funds).plus(site.funds).toFixed(4));
                                recharge.oldFunds = siteOldFunds;
                                recharge.newFunds = site.funds;
                                recharge = yield tem.save(recharge);
                                site = yield tem.save(site);
                                let userSite = recharge.userSite;
                                let fundsRecord = new FundsRecordSite_1.FundsRecordSite();
                                fundsRecord.oldFunds = siteOldFunds;
                                fundsRecord.funds = recharge.funds;
                                fundsRecord.newFunds = site.funds;
                                fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                                fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                                fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + recharge.funds;
                                fundsRecord.site = site;
                                fundsRecord.userSite = userSite;
                                yield tem.save(fundsRecord);
                                let message = new MessageUserSite_1.MessageUserSite();
                                message.user = userSite;
                                message.title = MessageBase_1.MessageTitle.Recharge;
                                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                                message.frontUrl = '/home/recharge/records';
                                message.aimId = recharge.id;
                                yield tem.save(message);
                                io.emit(site.id + 'changeFunds', site.funds);
                                io.emit('minusBadge', 'rechargesPlatform');
                                io.emit('platformRechargeDeal', recharge);
                                io.emit(userSite.id + 'plusMessageNum');
                            }
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                }
                else {
                    let recharge = new Recharge_1.Recharge();
                    recharge.alipayId = info.alipayId;
                    recharge.funds = info.money;
                    recharge.way = Recharge_1.RechargeWay.Auto;
                    let userOrSiteName = info.uid;
                    if (userOrSiteName) {
                        let isSite = userOrSiteName.search('/');
                        if (isSite != -1) {
                            let names = userOrSiteName.split('/');
                            let siteName = names[0];
                            let adminName = names[1];
                            let site = yield tem.findOne(Site_1.Site, { name: siteName });
                            let userSite = yield tem.findOne(UserSite_1.UserSite, { username: adminName });
                            if (site && userSite) {
                                let siteOldFunds = site.funds;
                                site.funds = parseFloat(utils_1.decimal(site.funds).plus(recharge.funds).toFixed(4));
                                recharge.intoAccountTime = utils_1.now();
                                recharge.oldFunds = siteOldFunds;
                                recharge.newFunds = site.funds;
                                recharge.state = Recharge_1.RechargeState.Success;
                                recharge.type = Recharge_1.RechargeType.Site;
                                recharge.userSite = userSite;
                                recharge.site = site;
                                recharge = yield tem.save(recharge);
                                site = yield tem.save(site);
                                let fundsRecord = new FundsRecordSite_1.FundsRecordSite();
                                fundsRecord.oldFunds = siteOldFunds;
                                fundsRecord.funds = recharge.funds;
                                fundsRecord.newFunds = site.funds;
                                fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                                fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                                fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + recharge.funds;
                                fundsRecord.site = site;
                                fundsRecord.userSite = userSite;
                                yield tem.save(fundsRecord);
                                let message = new MessageUserSite_1.MessageUserSite();
                                message.user = userSite;
                                message.title = MessageBase_1.MessageTitle.Recharge;
                                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                                message.frontUrl = '/home/recharge/records';
                                message.aimId = recharge.id;
                                yield tem.save(message);
                                io.emit(site.id + 'changeFunds', site.funds);
                                io.emit(userSite.id + 'plusMessageNum');
                            }
                            else {
                                yield tem.save(recharge);
                            }
                        }
                        else {
                            let user = yield tem.createQueryBuilder()
                                .select('user')
                                .from(User_1.User, 'user')
                                .where('user.username = :username', { username: userOrSiteName })
                                .leftJoinAndSelect('user.site', 'site')
                                .getOne();
                            if (user) {
                                let userOldFunds = user.funds;
                                user.funds = parseFloat(utils_1.decimal(user.funds).plus(recharge.funds).toFixed(4));
                                recharge.intoAccountTime = utils_1.now();
                                recharge.oldFunds = userOldFunds;
                                recharge.newFunds = user.funds;
                                recharge.state = Recharge_1.RechargeState.Success;
                                recharge.type = Recharge_1.RechargeType.User;
                                recharge.user = user;
                                recharge.site = user.site;
                                recharge = yield tem.save(recharge);
                                yield tem.save(user);
                                let fundsRecord = new FundsRecordUser_1.FundsRecordUser();
                                fundsRecord.oldFunds = userOldFunds;
                                fundsRecord.funds = recharge.funds;
                                fundsRecord.newFunds = user.funds;
                                fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                                fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                                fundsRecord.description = '账户充值： ￥ ' + recharge.funds;
                                fundsRecord.user = user;
                                yield tem.save(fundsRecord);
                                let message = new MessageUser_1.MessageUser();
                                message.user = user;
                                message.title = MessageBase_1.MessageTitle.Recharge;
                                message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                                message.frontUrl = '/recharge/records';
                                message.aimId = recharge.id;
                                yield tem.save(message);
                                io.emit(user.id + 'changeFunds', user.funds);
                                io.emit(user.id + 'plusMessageNum');
                            }
                            else {
                                yield tem.save(recharge);
                            }
                        }
                    }
                    else {
                        yield tem.save(recharge);
                    }
                }
            }));
        });
    }
    static addOrRecharge(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { alipayId, type, way, user, userSite, site } = info;
            utils_1.assert((alipayId.length == 28 || alipayId.length == 32) && utils_1.isInteger(alipayId), '请输入28或32位数字支付宝充值交易号');
            utils_1.assert(parseInt(alipayId.substr(0, 8)) - utils_1.todayNum() >= 0, '该交易号已经过期');
            utils_1.assert(!(yield Recharge_1.Recharge.findHandCommited(alipayId)), '该交易号已提交，请勿重复提交');
            let recharge = yield Recharge_1.Recharge.findAutoCommited(alipayId);
            if (recharge) {
                if (type === Recharge_1.RechargeType.User) {
                    yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                        let userOldFunds = user.funds;
                        user.funds = parseFloat(utils_1.decimal(user.funds).plus(recharge.funds).toFixed(4));
                        recharge.intoAccountTime = utils_1.now();
                        recharge.oldFunds = userOldFunds;
                        recharge.newFunds = user.funds;
                        recharge.state = Recharge_1.RechargeState.Success;
                        recharge.type = Recharge_1.RechargeType.User;
                        recharge.user = user;
                        recharge.site = site;
                        recharge = yield tem.save(recharge);
                        user = yield tem.save(user);
                        let fundsRecord = new FundsRecordUser_1.FundsRecordUser();
                        fundsRecord.oldFunds = userOldFunds;
                        fundsRecord.funds = recharge.funds;
                        fundsRecord.newFunds = user.funds;
                        fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                        fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                        fundsRecord.description = '账户充值： ￥ ' + recharge.funds;
                        fundsRecord.user = user;
                        yield tem.save(fundsRecord);
                        let message = new MessageUser_1.MessageUser();
                        message.user = user;
                        message.title = MessageBase_1.MessageTitle.Recharge;
                        message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                        message.frontUrl = '/recharge/records';
                        message.aimId = recharge.id;
                        yield tem.save(message);
                        io.emit(user.id + 'changeFunds', user.funds);
                        io.emit(user.id + 'plusMessageNum');
                    }));
                }
                else if (type === Recharge_1.RechargeType.Site) {
                    yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                        let siteOldFunds = site.funds;
                        site.funds = parseFloat(utils_1.decimal(site.funds).plus(recharge.funds).toFixed(4));
                        recharge.intoAccountTime = utils_1.now();
                        recharge.oldFunds = siteOldFunds;
                        recharge.newFunds = site.funds;
                        recharge.state = Recharge_1.RechargeState.Success;
                        recharge.type = Recharge_1.RechargeType.Site;
                        recharge.userSite = userSite;
                        recharge.site = site;
                        recharge = yield tem.save(recharge);
                        site = yield tem.save(site);
                        let fundsRecord = new FundsRecordSite_1.FundsRecordSite();
                        fundsRecord.oldFunds = siteOldFunds;
                        fundsRecord.funds = recharge.funds;
                        fundsRecord.newFunds = site.funds;
                        fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                        fundsRecord.type = FundsRecordBase_1.FundsRecordType.Recharge;
                        fundsRecord.description = '管理员： ' + userSite.username + ' 给站点充值： ￥ ' + recharge.funds;
                        fundsRecord.site = site;
                        fundsRecord.userSite = userSite;
                        yield tem.save(fundsRecord);
                        let message = new MessageUserSite_1.MessageUserSite();
                        message.user = userSite;
                        message.title = MessageBase_1.MessageTitle.Recharge;
                        message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                        message.frontUrl = '/home/recharge/records';
                        message.aimId = recharge.id;
                        yield tem.save(message);
                        io.emit(site.id + 'changeFunds', site.funds);
                        io.emit(userSite.id + 'plusMessageNum');
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
            utils_1.assert(recharge.state === Recharge_1.RechargeState.Wait, '当前充值已经处理了');
            let type = recharge.type;
            if (type === Recharge_1.RechargeType.User) {
                yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                    let user = recharge.user;
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
                    let message = new MessageUser_1.MessageUser();
                    message.user = user;
                    message.title = MessageBase_1.MessageTitle.Recharge;
                    message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                    message.frontUrl = '/recharge/records';
                    message.aimId = recharge.id;
                    yield tem.save(message);
                    io.emit(user.id + 'plusMessageNum');
                }));
            }
            else if (type === Recharge_1.RechargeType.Site) {
                return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                    let site = recharge.site;
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
                    let message = new MessageUserSite_1.MessageUserSite();
                    message.user = userSite;
                    message.title = MessageBase_1.MessageTitle.Recharge;
                    message.content = `交易号: ${recharge.alipayId} 充值: ${recharge.funds} 元, 已经到账！`;
                    message.frontUrl = '/home/recharge/records';
                    message.aimId = recharge.id;
                    yield tem.save(message);
                    io.emit(userSite.id + 'plusMessageNum');
                }));
            }
        });
    }
    static handRechargeFail(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, failMsg } = info;
            let recharge = yield Recharge_1.Recharge.findById(id);
            utils_1.assert(recharge.state === Recharge_1.RechargeState.Wait, '当前充值已经处理了');
            recharge.intoAccountTime = utils_1.now();
            recharge.failMsg = failMsg;
            recharge.state = Recharge_1.RechargeState.Fail;
            recharge = yield recharge.save();
            io.emit('minusBadge', 'rechargesPlatform');
            io.emit('platformRechargeFail', recharge);
            if (recharge.type === Recharge_1.RechargeType.User) {
                let message = new MessageUser_1.MessageUser();
                message.user = recharge.user;
                message.title = MessageBase_1.MessageTitle.RechargeError;
                message.content = `交易号: ${recharge.alipayId} 充值失败 -- ${recharge.failMsg}`;
                message.frontUrl = '/recharge/records';
                message.aimId = recharge.id;
                yield message.save();
                io.emit(recharge.user.id + 'plusMessageNum');
            }
            else {
                let message = new MessageUserSite_1.MessageUserSite();
                message.user = recharge.userSite;
                message.title = MessageBase_1.MessageTitle.RechargeError;
                message.content = `交易号: ${recharge.alipayId} 充值失败 -- ${recharge.failMsg}`;
                message.frontUrl = '/home/recharge/records';
                message.aimId = recharge.id;
                yield message.save();
                io.emit(recharge.userSite.id + 'plusMessageNum');
            }
        });
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.all(page);
        });
    }
    static userAll(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.userAllRecords(userId, page);
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
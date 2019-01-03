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
const User_1 = require("../entity/User");
const RoleUser_1 = require("../entity/RoleUser");
const utils_1 = require("../utils");
const typeorm_1 = require("typeorm");
const FundsRecordUser_1 = require("../entity/FundsRecordUser");
const FundsRecordBase_1 = require("../entity/FundsRecordBase");
const RemarkUser_1 = require("../entity/RemarkUser");
const RightUser_1 = require("../entity/RightUser");
const FundsRecordSite_1 = require("../entity/FundsRecordSite");
const Site_1 = require("../entity/Site");
const MessageUser_1 = require("../entity/MessageUser");
class CUser {
    static platNewUserOfDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.platNewUserOfDay(date);
        });
    }
    static siteNewUserOfDay(siteId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.siteNewUserOfDay(siteId, date);
        });
    }
    static getAllFunds() {
        return __awaiter(this, void 0, void 0, function* () {
            let siteFunds = yield Site_1.Site.getAllFunds();
            let userFunds = yield User_1.User.getAllFunds();
            return {
                funds: utils_1.decimal(siteFunds.funds || 0).plus(userFunds.funds || 0).toString(),
                freezeFunds: utils_1.decimal(siteFunds.freezeFunds || 0).plus(userFunds.freezeFunds || 0).toString()
            };
        });
    }
    static getAllFundsOfSite(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.getAllFundsOfSite(siteId);
        });
    }
    static getAllStatusInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let userStatusInfo = {
                normal: 0,
                freeze: 0,
                ban: 0
            };
            let result = yield User_1.User.getAllStatusInfo();
            result.forEach((item) => {
                switch (item.state) {
                    case '正常':
                        userStatusInfo.normal = item.num;
                        break;
                    case '冻结':
                        userStatusInfo.freeze = item.num;
                        break;
                    case '禁用':
                        userStatusInfo.ban = item.num;
                        break;
                }
            });
            return userStatusInfo;
        });
    }
    static getAllStatusInfoOfSite(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userStatusInfo = {
                normal: 0,
                freeze: 0,
                ban: 0
            };
            let result = yield User_1.User.getAllStatusInfoOfSite(siteId);
            result.forEach((item) => {
                switch (item.state) {
                    case '正常':
                        userStatusInfo.normal = item.num;
                        break;
                    case '冻结':
                        userStatusInfo.freeze = item.num;
                        break;
                    case '禁用':
                        userStatusInfo.ban = item.num;
                        break;
                }
            });
            return userStatusInfo;
        });
    }
    static getUserParent(tem, user, upRoleUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let userNow = yield tem.createQueryBuilder()
                .select('user')
                .from(User_1.User, 'user')
                .where('user.id = :id', { id: user.id })
                .innerJoinAndSelect('user.parent', 'parent')
                .leftJoinAndSelect('parent.role', 'parentRole')
                .getOne();
            if (userNow) {
                let parent = userNow.parent;
                if (!parent.role.greaterThan(upRoleUser.role)) {
                    return yield CUser.getUserParent(tem, parent, upRoleUser);
                }
                else {
                    return parent;
                }
            }
            else {
                return null;
            }
        });
    }
    static upUserRole(userId, io) {
        return __awaiter(this, void 0, void 0, function* () {
            return typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let user = yield tem.createQueryBuilder()
                    .select('user')
                    .from(User_1.User, 'user')
                    .where('user.id = :id', { id: userId })
                    .leftJoinAndSelect('user.parent', 'parent')
                    .leftJoinAndSelect('parent.role', 'parentRole')
                    .leftJoinAndSelect('user.role', 'role')
                    .leftJoinAndSelect('user.site', 'site')
                    .getOne();
                let role = user.role;
                let site = user.site;
                let parent = user.parent;
                let roleUpPrice = site.getRoleUpPriceByRoleType(role.type);
                utils_1.assert(user.funds >= roleUpPrice, '账户余额不足，请充值');
                let upRole = yield tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUser_1.RoleUser, 'role')
                    .innerJoin('role.site', 'site', 'site.id = :siteId', { siteId: site.id })
                    .where('role.type = :type', { type: role.getUpRoleType() })
                    .getOne();
                let parentProfit = parseFloat(utils_1.decimal(roleUpPrice).times(site.upperRatio).toFixed(4));
                let siteProfit = parent ? parseFloat(utils_1.decimal(roleUpPrice).minus(parentProfit).toFixed(4)) : roleUpPrice;
                user.role = upRole;
                let userNewFunds = parseFloat(utils_1.decimal(user.funds).minus(roleUpPrice).toFixed(4));
                let userFundsRecord = new FundsRecordUser_1.FundsRecordUser();
                userFundsRecord.oldFunds = user.funds;
                userFundsRecord.funds = roleUpPrice;
                userFundsRecord.newFunds = userNewFunds;
                userFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                userFundsRecord.type = FundsRecordBase_1.FundsRecordType.UpRole;
                userFundsRecord.description = '从 ' + role.name + ' 升级到 ' + upRole.name + ', 消费: ￥' + roleUpPrice;
                userFundsRecord.user = user;
                yield tem.save(userFundsRecord);
                user.funds = userNewFunds;
                if (parent && !parent.role.greaterThan(user.role)) {
                    user.parent = yield CUser.getUserParent(tem, parent, user);
                }
                yield tem.save(user);
                if (parent) {
                    let parentNewFunds = parseFloat(utils_1.decimal(parent.funds).plus(parentProfit).toFixed(4));
                    let parentFundsRecord = new FundsRecordUser_1.FundsRecordUser();
                    parentFundsRecord.oldFunds = parent.funds;
                    parentFundsRecord.funds = parentProfit;
                    parentFundsRecord.newFunds = parentNewFunds;
                    parentFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                    parentFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                    parentFundsRecord.profitUsername = user.username;
                    parentFundsRecord.description = '下级: ' + user.username + ' 从 ' + role.name + ' 升级到 ' + upRole.name + ', 返利: ￥' + parentProfit;
                    parentFundsRecord.user = parent;
                    yield tem.save(parentFundsRecord);
                    parent.funds = parentNewFunds;
                    yield tem.save(parent);
                    io.emit(parent.id + 'changeFunds', parent.funds);
                }
                let siteNewFunds = parseFloat(utils_1.decimal(site.funds).plus(siteProfit).toFixed(4));
                let siteFundsRecord = new FundsRecordSite_1.FundsRecordSite();
                siteFundsRecord.oldFunds = site.profit;
                siteFundsRecord.funds = siteProfit;
                siteFundsRecord.newFunds = siteNewFunds;
                siteFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                siteFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                siteFundsRecord.profitUsername = user.username;
                siteFundsRecord.description = '用户: ' + user.username + ' 从 ' + role.name + ' 升级到 ' + upRole.name + ', 返利: ￥' + siteProfit;
                siteFundsRecord.site = site;
                yield tem.save(siteFundsRecord);
                site.funds = siteNewFunds;
                yield tem.save(site);
                io.emit(site.id + 'changeFunds', site.funds);
                let rights = yield tem.createQueryBuilder()
                    .select('right')
                    .from(RightUser_1.RightUser, 'right')
                    .where('right.pId = :pId', { pId: '0' })
                    .leftJoinAndSelect('right.children', 'menu')
                    .leftJoinAndSelect('menu.children', 'menuItem')
                    .getMany();
                utils_1.sortRights(rights);
                let rightMenus = upRole.treeRights(rights);
                return {
                    userFunds: user.funds,
                    roleId: upRole.id,
                    roleName: upRole.name,
                    roleType: upRole.type,
                    permissions: upRole.rights,
                    rightMenus: rightMenus
                };
            }));
        });
    }
    static getUserLoginInitData(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                yield tem.update(User_1.User, user.id, { lastLoginTime: utils_1.now() });
                let rights = yield tem.createQueryBuilder()
                    .select('right')
                    .from(RightUser_1.RightUser, 'right')
                    .where('right.pId = :pId', { pId: '0' })
                    .leftJoinAndSelect('right.children', 'menu')
                    .leftJoinAndSelect('menu.children', 'menuItem')
                    .getMany();
                utils_1.sortRights(rights);
                let treeRights = user.role.treeRights(rights);
                return {
                    userId: user.id,
                    username: user.username,
                    userState: user.getState,
                    funds: user.funds,
                    freezeFunds: user.freezeFunds,
                    roleId: user.role.id,
                    roleType: user.role.type,
                    roleName: user.role.name,
                    permissions: user.role.rights,
                    rightMenus: treeRights,
                    messageNum: yield MessageUser_1.MessageUser.getWaitCount(user.id),
                };
            }));
        });
    }
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new User_1.User();
            user.site = info.site;
            user.username = info.username;
            user.password = info.password;
            user.setState = info.state;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            user.role = info.role;
            return yield user.save();
        });
    }
    static saveLower(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new User_1.User();
            user.username = info.username;
            user.password = info.password;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            user.parent = info.parent;
            user.role = (yield RoleUser_1.RoleUser.getRoleBySiteIdAndType(info.site.id, RoleUser_1.RoleType.Gold));
            user.site = info.site;
            return yield user.save();
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findById(id);
        });
    }
    static updateSelfContact(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.User.update(info.id, {
                phone: info.phone,
                weixin: info.weixin,
                qq: info.qq,
                email: info.email
            });
        });
    }
    static changePass(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = info.user;
            user.password = info.pass;
            return yield user.save();
        });
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.all(page);
        });
    }
    static searchByUsername(username, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.searchByUsername(username, page);
        });
    }
    static searchByUsernameSite(siteId, username, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.searchByUsernameSite(siteId, username, page);
        });
    }
    static lowerUserOf(parentId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.lowerUserOf(parentId, page);
        });
    }
    static lowerUserOfSite(parentId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.lowerUserOfSite(parentId, page);
        });
    }
    static getParentUserPlat(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.getParentUserPlat(username);
        });
    }
    static getParentUserSite(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.getParentUserSite(username);
        });
    }
    static siteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.siteAll(siteId, page);
        });
    }
    static lowerUserAll(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.getAllLowerUser(userId, page);
        });
    }
    static findByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByName(username);
        });
    }
    static changeFunds(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = info.id, state = info.state, money = parseFloat(info.money), reason = info.reason;
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let user = yield tem.findOne(User_1.User, id);
                let fundsRecord = new FundsRecordUser_1.FundsRecordUser();
                fundsRecord.oldFunds = user.funds;
                fundsRecord.type = FundsRecordBase_1.FundsRecordType.Handle;
                if (state === 'plus_consume') {
                    user.funds = parseFloat(utils_1.decimal(user.funds).plus(money).toFixed(4));
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                }
                else {
                    utils_1.assert(user.funds >= money, '用户账户余额不足，无法减少！');
                    user.funds = parseFloat(utils_1.decimal(user.funds).minus(money).toFixed(4));
                    fundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                }
                fundsRecord.funds = money;
                fundsRecord.newFunds = user.funds;
                fundsRecord.description = reason;
                fundsRecord.user = user;
                yield tem.save(user);
                yield tem.save(fundsRecord);
                io.emit(user.id + 'changeFunds', user.funds);
                return user.funds;
            }));
        });
    }
    static resetPassword(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findById(userId);
            user.password = '1234';
            yield user.save();
        });
    }
    static changeState(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findById(info.id);
            user.setState = info.state;
            user = yield user.save();
            io.emit(user.id + 'changeState', user.getState);
            io.emit(user.site.id + 'mgUserChangeState', { id: user.id, state: user.getState });
            io.emit('mgUserChangeState', { id: user.id, state: user.getState });
        });
    }
    static updateOtherContact(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findById(info.id);
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            user = yield user.save();
            io.emit(user.id + 'changeContact', {
                phone: user.phone,
                weixin: user.weixin,
                qq: user.qq,
                email: user.email
            });
        });
    }
    static addUserAdminRemark(info, userAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            let remark = new RemarkUser_1.RemarkUser();
            remark.content = info.content;
            remark.type = RemarkUser_1.RemarkWitch.Platform;
            remark.user = (yield User_1.User.findById(info.userId));
            remark.userAdmin = userAdmin;
            yield remark.save();
        });
    }
    static addUserSiteRemark(info, userSite) {
        return __awaiter(this, void 0, void 0, function* () {
            let remark = new RemarkUser_1.RemarkUser();
            remark.content = info.content;
            remark.type = RemarkUser_1.RemarkWitch.Site;
            remark.user = (yield User_1.User.findById(info.userId));
            remark.userSite = userSite;
            yield remark.save();
        });
    }
    static loadRemarksByUserAdmin(userId, userAdminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RemarkUser_1.RemarkUser.findByUserIdAndUserAdminId(userId, userAdminId);
        });
    }
    static loadRemarksByUserSite(userId, userSiteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RemarkUser_1.RemarkUser.findByUserIdAndUserSiteId(userId, userSiteId);
        });
    }
}
exports.CUser = CUser;
//# sourceMappingURL=CUser.js.map
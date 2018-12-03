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
const ConsumeUser_1 = require("../entity/ConsumeUser");
const ConsumeBase_1 = require("../entity/ConsumeBase");
const RemarkUser_1 = require("../entity/RemarkUser");
class CUser {
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
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.all();
        });
    }
    static siteAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.siteAll(siteId);
        });
    }
    static lowerUserAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.getAllLowerUser(userId);
        });
    }
    static findByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.findByName(username);
        });
    }
    static changeFunds(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = info.id, state = info.state, money = parseFloat(info.money), reason = info.reason, userNowFunds = 0;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let user = yield tem.findOne(User_1.User, id);
                let consumeUser = new ConsumeUser_1.ConsumeUser();
                let oldFunds = user.funds;
                consumeUser.type = ConsumeBase_1.ConsumeType.Handle;
                if (state === 'plus_consume') {
                    user.funds = parseFloat(utils_1.decimal(oldFunds).plus(money).toFixed(4));
                    consumeUser.upOrDown = ConsumeBase_1.ConsumeUpDown.Plus;
                }
                else {
                    user.funds = parseFloat(utils_1.decimal(oldFunds).minus(money).toFixed(4));
                    consumeUser.upOrDown = ConsumeBase_1.ConsumeUpDown.Minus;
                }
                userNowFunds = user.funds;
                consumeUser.oldFunds = oldFunds;
                consumeUser.funds = money;
                consumeUser.newFunds = user.funds;
                consumeUser.description = reason;
                consumeUser.user = user;
                yield tem.save(user);
                yield tem.save(consumeUser);
                io.emit(user.id + 'changeFunds', user.funds);
            }));
            return userNowFunds;
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
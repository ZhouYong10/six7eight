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
const UserSite_1 = require("../entity/UserSite");
const RoleUserSite_1 = require("../entity/RoleUserSite");
const utils_1 = require("../utils");
const typeorm_1 = require("typeorm");
const ProductTypeSite_1 = require("../entity/ProductTypeSite");
const RightSite_1 = require("../entity/RightSite");
class CUserSite {
    static save(info, site) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new UserSite_1.UserSite();
            user.site = site;
            user.username = info.username;
            user.password = info.password;
            user.setState = info.state;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            user.role = (yield RoleUserSite_1.RoleUserSite.findById(info.role));
            return yield user.save();
        });
    }
    static updateLoginTime(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserSite_1.UserSite.update(info.id, { lastLoginTime: info.time });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.findById(id);
        });
    }
    static updateContact(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserSite_1.UserSite.update(info.id, {
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
    static allAdmins(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.getAll(siteId);
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.findByName(username);
        });
    }
    static changeRole(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let admin = yield UserSite_1.UserSite.findById(info.adminId);
                admin.role = (yield RoleUserSite_1.RoleUserSite.findById(info.roleId));
                admin = yield admin.save();
                let role = admin.role;
                let site = admin.site;
                let typeProducts = yield tem.createQueryBuilder()
                    .select('type')
                    .from(ProductTypeSite_1.ProductTypeSite, 'type')
                    .innerJoin('type.site', 'site', 'site.id = :id', { id: site.id })
                    .leftJoinAndSelect('type.productSites', 'product')
                    .orderBy('type.createTime', 'DESC')
                    .getMany();
                let productRights = utils_1.productToRight(typeProducts, []);
                let rights = yield tem.getTreeRepository(RightSite_1.RightSite).findTrees();
                utils_1.sortRights(rights);
                let treeRights = role.treeRights(productRights.concat(rights));
                io.emit(admin.id + 'changeUserRole', { menuRights: treeRights, role: role });
            }));
        });
    }
    static changeState(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = yield UserSite_1.UserSite.findById(info.id);
            admin.setState = info.state;
            admin = yield admin.save();
            io.emit(admin.id + 'changeUserState', admin.getState);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.delById(id);
        });
    }
}
exports.CUserSite = CUserSite;
//# sourceMappingURL=CUserSite.js.map
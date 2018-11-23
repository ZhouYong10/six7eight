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
const UserAdmin_1 = require("../entity/UserAdmin");
const RoleUserAdmin_1 = require("../entity/RoleUserAdmin");
const ProductType_1 = require("../entity/ProductType");
const typeorm_1 = require("typeorm");
const RightAdmin_1 = require("../entity/RightAdmin");
const utils_1 = require("../utils");
class CUserAdmin {
    static changePass(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = info.user;
            user.password = info.pass;
            return yield user.save();
        });
    }
    static updateContact(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserAdmin_1.UserAdmin.update(info.id, {
                phone: info.phone,
                weixin: info.weixin,
                qq: info.qq,
                email: info.email
            });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.findById(id);
        });
    }
    static allAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.getAll();
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.findByName(username);
        });
    }
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new UserAdmin_1.UserAdmin();
            user.username = info.username;
            user.password = info.password;
            user.role = (yield RoleUserAdmin_1.RoleUserAdmin.findById(info.role));
            user.setState = info.state;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            return yield user.save();
        });
    }
    static changeRole(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let admin = yield UserAdmin_1.UserAdmin.findById(info.adminId);
                admin.role = (yield RoleUserAdmin_1.RoleUserAdmin.findById(info.roleId));
                admin = yield admin.save();
                let role = admin.role;
                let typeProducts = yield tem.createQueryBuilder()
                    .select('type')
                    .from(ProductType_1.ProductType, 'type')
                    .leftJoinAndSelect('type.products', 'product')
                    .orderBy('type.createTime', 'DESC')
                    .getMany();
                let productRights = utils_1.productToRight(typeProducts, []);
                let rights = yield tem.getTreeRepository(RightAdmin_1.RightAdmin).findTrees();
                utils_1.sortRights(rights);
                let treeRights = role.treeRights(productRights.concat(rights));
                io.emit(admin.id + 'changeUserRole', { menuRights: treeRights, role: role });
            }));
        });
    }
    static changeState(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = yield UserAdmin_1.UserAdmin.findById(info.id);
            admin.setState = info.state;
            admin = yield admin.save();
            io.emit(admin.id + 'changeUserState', admin.getState);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.delById(id);
        });
    }
}
exports.CUserAdmin = CUserAdmin;
//# sourceMappingURL=CUserAdmin.js.map
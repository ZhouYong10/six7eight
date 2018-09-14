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
const ProductType_1 = require("../entity/ProductType");
class CProductTypes {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.ProductType.getAll();
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.ProductType.findByName(name);
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = new ProductType_1.ProductType();
            type.name = info.name;
            type.onSale = info.onSale;
            return yield type.save();
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = yield ProductType_1.ProductType.findById(info.id);
            type.name = info.name;
            type.onSale = info.onSale;
            return yield type.save();
        });
    }
    static changePass(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserAdmin_1.UserAdmin.findById(info.id);
            user.password = info.pass;
            yield user.save();
            return;
        });
    }
    static updateInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserAdmin_1.UserAdmin.findById(info.id);
            user.username = info.username;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            return yield user.save();
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.findById(id);
        });
    }
    static updateLoginTime(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = new UserAdmin_1.UserAdmin();
            admin.lastLoginTime = info.time;
            return yield UserAdmin_1.UserAdmin.update(info.id, admin);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.delById(id);
        });
    }
}
exports.CProductTypes = CProductTypes;
//# sourceMappingURL=CProductTypes.js.map
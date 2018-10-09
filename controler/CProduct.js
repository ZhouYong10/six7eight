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
const Product_1 = require("../entity/Product");
const CProductTypes_1 = require("./CProductTypes");
class CProduct {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.Product.getAll();
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.Product.findByName(name);
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(info, '=================');
            let product = new Product_1.Product();
            product.name = info.name;
            product.price = info.price;
            product.sitePrice = info.sitePrice;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.onSale = info.onSale;
            product.attrs = info.attrs;
            product.productType = yield CProductTypes_1.CProductTypes.findByName(info.type);
            return yield product.save();
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = yield Product_1.Product.findById(info.id);
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
exports.CProduct = CProduct;
//# sourceMappingURL=CProduct.js.map
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
const Site_1 = require("../entity/Site");
const RightSite_1 = require("../entity/RightSite");
const RoleUser_1 = require("../entity/RoleUser");
const RightUser_1 = require("../entity/RightUser");
const typeorm_1 = require("typeorm");
const RoleUserSite_1 = require("../entity/RoleUserSite");
const UserSite_1 = require("../entity/UserSite");
const ProductType_1 = require("../entity/ProductType");
const ProductTypeSite_1 = require("../entity/ProductTypeSite");
const ProductSite_1 = require("../entity/ProductSite");
class CSite {
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.getAll();
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.findById(id);
        });
    }
    static editInfo(site, info) {
        return __awaiter(this, void 0, void 0, function* () {
            site.name = info.name;
            site.address = info.address;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            return yield site.save();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = new Site_1.Site();
            site.name = info.name;
            site.address = info.address;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                site = yield tem.save(site);
                let roleRights = [yield RightUser_1.RightUser.findTrees(), yield RightUser_1.RightUser.getAllLeaf()];
                let roleGold = new RoleUser_1.RoleUser();
                roleGold.name = '金牌代理';
                roleGold.type = RoleUser_1.RoleType.Gold;
                roleGold.rights = roleRights;
                roleGold.site = site;
                yield tem.save(roleGold);
                let roleSuper = new RoleUser_1.RoleUser();
                roleSuper.name = '超级代理';
                roleSuper.type = RoleUser_1.RoleType.Super;
                roleSuper.rights = roleRights;
                roleSuper.site = site;
                yield tem.save(roleSuper);
                let roleTop = new RoleUser_1.RoleUser();
                roleTop.name = '顶级代理';
                roleTop.type = RoleUser_1.RoleType.Top;
                roleTop.rights = roleRights;
                roleTop.site = site;
                yield tem.save(roleTop);
                let roleAdmin = new RoleUserSite_1.RoleUserSite();
                roleAdmin.name = '系统管理员';
                roleAdmin.rights = [yield RightSite_1.RightSite.findTrees(), yield RightSite_1.RightSite.getAllLeaf()];
                roleAdmin.site = site;
                roleAdmin = yield tem.save(roleAdmin);
                let admin = new UserSite_1.UserSite();
                admin.username = 'admin';
                admin.password = '1234';
                admin.role = roleAdmin;
                admin.site = site;
                yield tem.save(admin);
                let productTypes = yield tem.createQueryBuilder()
                    .select('productType')
                    .from(ProductType_1.ProductType, 'productType')
                    .leftJoinAndSelect('productType.products', 'products')
                    .getMany();
                for (let i = 0; i < productTypes.length; i++) {
                    let productType = productTypes[i];
                    let products = productType.products;
                    let productTypeSite = new ProductTypeSite_1.ProductTypeSite();
                    productTypeSite.name = productType.name;
                    productTypeSite.onSale = false;
                    productTypeSite.productType = productType;
                    productTypeSite.site = site;
                    productTypeSite = yield tem.save(productTypeSite);
                    if (products) {
                        for (let j = 0; j < products.length; j++) {
                            let product = products[j];
                            let productSite = new ProductSite_1.ProductSite();
                            productSite.name = product.name;
                            productSite.price = product.sitePrice;
                            productSite.topPrice = product.topPrice;
                            productSite.superPrice = product.superPrice;
                            productSite.goldPrice = product.goldPrice;
                            productSite.onSale = false;
                            productSite.attrs = product.attrs;
                            productSite.product = product;
                            productSite.site = site;
                            productSite.productTypeSite = productTypeSite;
                            yield tem.save(productSite);
                        }
                    }
                }
            }));
            return site;
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CSite.editInfo(yield Site_1.Site.findById(info.id), info);
        });
    }
    static updateInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = yield Site_1.Site.findById(info.id);
            site.name = info.name;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            site.seoKey = info.seoKey;
            site.description = info.description;
            return yield site.save();
        });
    }
}
exports.CSite = CSite;
//# sourceMappingURL=CSite.js.map
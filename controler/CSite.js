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
const ProductTypeBase_1 = require("../entity/ProductTypeBase");
const utils_1 = require("../utils");
class CSite {
    static allSites() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.getAllSites();
        });
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.getAll(page);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.findById(id);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.findByName(name);
        });
    }
    static findByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.findByAddress(address);
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = new Site_1.Site();
            site.name = info.name;
            site.address = info.address;
            site.remark = info.remark;
            site.goldUpPrice = 100;
            site.superUpPrice = 200;
            site.upperRatio = 0.5;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                site = yield tem.save(site);
                let adminRights = yield RightSite_1.RightSite.getAllPermissions();
                let roleAdmin = new RoleUserSite_1.RoleUserSite();
                roleAdmin.type = RoleUserSite_1.RoleUserSiteType.Site;
                roleAdmin.name = '系统管理员';
                roleAdmin.editRights = adminRights;
                roleAdmin.rights = adminRights;
                roleAdmin.site = site;
                let productTypes = yield tem.createQueryBuilder()
                    .select('productType')
                    .from(ProductType_1.ProductType, 'productType')
                    .leftJoinAndSelect('productType.products', 'products')
                    .getMany();
                for (let i = 0; i < productTypes.length; i++) {
                    let productType = productTypes[i];
                    let products = productType.products;
                    let productTypeSite = new ProductTypeSite_1.ProductTypeSite();
                    productTypeSite.type = ProductTypeBase_1.WitchType.Platform;
                    productTypeSite.name = productType.name;
                    productTypeSite.onSale = productType.onSale;
                    productTypeSite.productType = productType;
                    productTypeSite.site = site;
                    productTypeSite = yield tem.save(productTypeSite);
                    roleAdmin.addProductTypeToRights(productTypeSite.id);
                    if (products && products.length > 0) {
                        for (let j = 0; j < products.length; j++) {
                            let product = products[j];
                            let productSite = new ProductSite_1.ProductSite();
                            productSite.type = ProductTypeBase_1.WitchType.Platform;
                            productSite.name = product.name;
                            productSite.price = product.price;
                            productSite.sitePrice = product.sitePrice;
                            productSite.topPrice = product.topPrice;
                            productSite.superPrice = product.superPrice;
                            productSite.goldPrice = product.goldPrice;
                            productSite.orderTip = product.orderTip;
                            productSite.onSale = product.onSale;
                            productSite.minNum = product.minNum;
                            productSite.speed = product.speed;
                            productSite.attrs = product.attrs;
                            productSite.product = product;
                            productSite.site = site;
                            productSite.productTypeSite = productTypeSite;
                            productSite = yield tem.save(productSite);
                            roleAdmin.addProductToRights(productTypeSite.id, productSite.id);
                        }
                    }
                }
                roleAdmin = yield tem.save(roleAdmin);
                let admin = new UserSite_1.UserSite();
                admin.username = info.username;
                admin.password = '1234';
                admin.role = roleAdmin;
                admin.site = site;
                yield tem.save(admin);
                let roleRights = yield RightUser_1.RightUser.getAllPermissions();
                let roleGold = new RoleUser_1.RoleUser();
                roleGold.name = '金牌代理';
                roleGold.type = RoleUser_1.RoleType.Gold;
                roleGold.editRights = roleRights;
                roleGold.rights = roleRights;
                roleGold.site = site;
                yield tem.save(roleGold);
                let roleSuper = new RoleUser_1.RoleUser();
                roleSuper.name = '超级代理';
                roleSuper.type = RoleUser_1.RoleType.Super;
                roleSuper.editRights = roleRights;
                roleSuper.rights = roleRights;
                roleSuper.site = site;
                yield tem.save(roleSuper);
                let roleTop = new RoleUser_1.RoleUser();
                roleTop.name = '顶级代理';
                roleTop.type = RoleUser_1.RoleType.Top;
                roleTop.editRights = roleRights;
                roleTop.rights = roleRights;
                roleTop.site = site;
                yield tem.save(roleTop);
            }));
            return site;
        });
    }
    static changeState(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = yield Site_1.Site.findById(info.id);
            site.setState = info.state;
            site = yield site.save();
            if (site.getState === Site_1.SiteState.Ban) {
                io.emit(site.id + 'siteIsBan');
            }
            io.emit('mgSiteChangeState', { id: site.id, state: site.getState });
        });
    }
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = yield Site_1.Site.findById(info.id);
            site.name = info.name;
            site.address = info.address;
            site.remark = info.remark;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            site = yield site.save();
            io.emit(site.id + 'updateSiteName', site.name);
        });
    }
    static updateInfo(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = yield Site_1.Site.findById(info.id);
            if (info.name !== site.name) {
                io.emit(site.id + 'updateSiteName', info.name);
            }
            if (info.canRegister !== site.canRegister) {
                io.emit(site.id + 'changeCanSiteRegister', info.canRegister);
            }
            site.name = info.name;
            site.canRegister = info.canRegister;
            site.goldUpPrice = info.goldUpPrice;
            site.superUpPrice = info.superUpPrice;
            site.upperRatio = info.upperRatio;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            site.seoKey = info.seoKey;
            site.description = info.description;
            yield site.save();
        });
    }
    static getUserPlacards(siteAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = yield Site_1.Site.getUserPlacardsByAddress(siteAddress);
            utils_1.assert(site, '你访问的分站不存在！');
            let placards = site.placards.concat(site.platformPlacards);
            placards.sort((a, b) => {
                return Date.parse(b.createTime) - Date.parse(a.createTime);
            });
            return placards;
        });
    }
}
exports.CSite = CSite;
//# sourceMappingURL=CSite.js.map
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
const ProductSite_1 = require("../entity/ProductSite");
const CProductTypeSite_1 = require("./CProductTypeSite");
const typeorm_1 = require("typeorm");
const RoleUserSite_1 = require("../entity/RoleUserSite");
const utils_1 = require("../utils");
class CProductSite {
    static getAll(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.getAll(productIds);
        });
    }
    static getByTypeId(productIds, typeId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            switch (typeId) {
                case 'allTypeProducts':
                    result = yield ProductSite_1.ProductSite.getAll(productIds);
                    break;
                case 'siteSelfProducts':
                    result = yield ProductSite_1.ProductSite.getSiteSelf(productIds);
                    break;
                case 'platformProducts':
                    result = yield ProductSite_1.ProductSite.getPlatform(productIds);
                    break;
                default:
                    result = yield ProductSite_1.ProductSite.getByTypeId(productIds, typeId);
                    break;
            }
            return result;
        });
    }
    static productPlatformOnsale(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            let productPlatform = yield ProductSite_1.ProductSite.getPrototypeById(productId);
            return productPlatform.onSale;
        });
    }
    static setOnSale(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            let product = yield ProductSite_1.ProductSite.findById(id);
            product.onSale = onSale;
            return yield product.save();
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.findById(id);
        });
    }
    static findByNameAndTypeId(typeId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.findByNameAndTypeId(typeId, name);
        });
    }
    static getPrototypeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.getPrototypeById(id);
        });
    }
    static editInfo(product, info) {
        return __awaiter(this, void 0, void 0, function* () {
            product.name = info.name;
            product.sortNum = info.sortNum;
            product.sitePrice = info.sitePrice;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.orderTip = info.orderTip;
            product.onSale = info.onSale;
            product.minNum = info.minNum;
            product.speed = info.speed;
            product.attrs = info.attrs;
            product.productTypeSite = (yield CProductTypeSite_1.CProductTypeSite.findById(info.productTypeId));
        });
    }
    static add(info, user, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = user.site;
            let product = new ProductSite_1.ProductSite();
            yield CProductSite.editInfo(product, info);
            product.createUser = user.username;
            product.site = site;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                product = yield tem.save(product);
                user.role.addProductToRights(product.productTypeSite.id, product.id);
                yield tem.save(user.role);
                let productMenuRight = product.menuRightItem();
                io.emit(user.role.id + 'product', { typeId: product.productTypeSite.id, product: productMenuRight });
                io.emit(user.role.id + 'addProduct', product);
                if (user.role.type !== RoleUserSite_1.RoleUserSiteType.Site) {
                    let roleUserSite = yield tem.createQueryBuilder()
                        .select('role')
                        .from(RoleUserSite_1.RoleUserSite, 'role')
                        .innerJoin('role.site', 'site', 'site.id = :id', { id: site.id })
                        .where('role.type = :type', { type: RoleUserSite_1.RoleUserSiteType.Site })
                        .getOne();
                    roleUserSite.addProductToRights(product.productTypeSite.id, product.id);
                    yield tem.save(roleUserSite);
                    io.emit(roleUserSite.id + 'product', { typeId: product.productTypeSite.id, product: productMenuRight });
                    io.emit(roleUserSite.id + 'addProduct', product);
                }
                io.emit(site.id + 'product', { typeId: product.productTypeSite.id, product: productMenuRight });
            }));
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield ProductSite_1.ProductSite.findById(info.id);
            yield CProductSite.editInfo(product, info);
            return yield product.save();
        });
    }
    static updatePlatform(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, topPrice, superPrice, goldPrice } = info;
            let productSite = yield ProductSite_1.ProductSite.findById(id);
            let product = productSite.product;
            utils_1.assert(productSite, 'id为 “' + id + '” 的商品不存在！');
            utils_1.assert(superPrice - topPrice >= 0, '超级代理价格不能小于顶级代理价格');
            utils_1.assert(goldPrice - superPrice >= 0, '金牌代理价格不能小于超级代理价格');
            utils_1.assert(topPrice - product.topPrice >= 0, '顶级代理价格不能小于平台限制价格： ￥' + product.topPrice);
            utils_1.assert(superPrice - product.superPrice >= 0, '超级代理价格不能小于平台限制价格： ￥' + product.superPrice);
            utils_1.assert(goldPrice - product.goldPrice >= 0, '金牌代理价格不能小于平台限制价格： ￥' + product.goldPrice);
            productSite.topPrice = topPrice;
            productSite.superPrice = superPrice;
            productSite.goldPrice = goldPrice;
            return yield productSite.save();
        });
    }
    static priceBatchUpdate(productIds, info) {
        return __awaiter(this, void 0, void 0, function* () {
            let topScale = parseInt(info.topScale);
            let superScale = parseInt(info.superScale);
            let goldScale = parseInt(info.goldScale);
            utils_1.assert(topScale > 0, '一级加价比例不能为0');
            utils_1.assert(superScale >= topScale, '二级加价比例不能低于一级加价比例');
            utils_1.assert(goldScale >= superScale, '三级加价比例不能低于二级加价比例');
            if (productIds.length < 1) {
                productIds = [''];
            }
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let products = yield tem.createQueryBuilder()
                    .select('product')
                    .from(ProductSite_1.ProductSite, 'product')
                    .whereInIds(productIds)
                    .getMany();
                for (let i = 0; i < products.length; i++) {
                    let product = products[i];
                    product.topPrice = parseFloat(utils_1.decimal(product.topPrice).times(1 + topScale / 100).toFixed(4));
                    product.superPrice = parseFloat(utils_1.decimal(product.superPrice).times(1 + superScale / 100).toFixed(4));
                    product.goldPrice = parseFloat(utils_1.decimal(product.goldPrice).times(1 + goldScale / 100).toFixed(4));
                    yield tem.save(product);
                }
                return true;
            }));
        });
    }
    static priceBatchBack(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let productsSite = yield tem.createQueryBuilder()
                    .select('productSite')
                    .from(ProductSite_1.ProductSite, 'productSite')
                    .whereInIds(productIds)
                    .leftJoinAndSelect('productSite.product', 'product')
                    .getMany();
                for (let i = 0; i < productsSite.length; i++) {
                    let productSite = productsSite[i];
                    if (productSite.product) {
                        productSite.topPrice = productSite.product.topPrice;
                        productSite.superPrice = productSite.product.superPrice;
                        productSite.goldPrice = productSite.product.goldPrice;
                        yield tem.save(productSite);
                    }
                }
                return true;
            }));
        });
    }
    static getAllOnSaleProductIds(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let products = yield ProductSite_1.ProductSite.getAllOnSale(siteId);
            let productIds = products.map((product) => {
                return product.id;
            });
            return productIds;
        });
    }
}
exports.CProductSite = CProductSite;
//# sourceMappingURL=CProductSite.js.map
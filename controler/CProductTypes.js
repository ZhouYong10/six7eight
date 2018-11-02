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
const ProductType_1 = require("../entity/ProductType");
const typeorm_1 = require("typeorm");
const Site_1 = require("../entity/Site");
const ProductTypeSite_1 = require("../entity/ProductTypeSite");
const ProductTypeBase_1 = require("../entity/ProductTypeBase");
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
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                type = yield tem.save(type);
                let sites = yield tem.createQueryBuilder()
                    .select('site')
                    .from(Site_1.Site, 'site')
                    .getMany();
                if (sites.length > 0) {
                    for (let i = 0; i < sites.length; i++) {
                        let site = sites[i];
                        let typeSite = new ProductTypeSite_1.ProductTypeSite();
                        typeSite.type = ProductTypeBase_1.WitchType.Platform;
                        typeSite.name = type.name;
                        typeSite.onSale = type.onSale;
                        typeSite.productType = type;
                        typeSite.site = site;
                        yield tem.save(typeSite);
                    }
                }
            }));
            return type;
        });
    }
    static getTypeAndTypeSite(id, tem) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = yield tem.createQueryBuilder()
                .select('type')
                .from(ProductType_1.ProductType, 'type')
                .leftJoinAndSelect('type.productTypeSites', 'productTypeSites')
                .where('type.id = :id', { id: id })
                .getOne();
            let productTypeSites = type.productTypeSites;
            return { type: type, productTypeSites: productTypeSites };
        });
    }
    static setOnSale(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let { type, productTypeSites } = yield CProductTypes.getTypeAndTypeSite(id, tem);
                if (productTypeSites.length > 0) {
                    for (let i = 0; i < productTypeSites.length; i++) {
                        let productTypeSite = productTypeSites[i];
                        yield tem.update(ProductTypeSite_1.ProductTypeSite, productTypeSite.id, { onSale: !onSale });
                    }
                }
                yield tem.update(ProductType_1.ProductType, type.id, { onSale: !onSale });
            }));
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, name, onSale } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let { type, productTypeSites } = yield CProductTypes.getTypeAndTypeSite(id, tem);
                if (productTypeSites.length > 0) {
                    for (let i = 0; i < productTypeSites.length; i++) {
                        let productTypeSite = productTypeSites[i];
                        yield tem.update(ProductTypeSite_1.ProductTypeSite, productTypeSite.id, { name: name, onSale: onSale });
                    }
                }
                yield tem.update(ProductType_1.ProductType, type.id, { name: name, onSale: onSale });
            }));
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let type = yield tem.createQueryBuilder()
                    .select('type')
                    .from(ProductType_1.ProductType, 'type')
                    .leftJoinAndSelect('type.productTypeSites', 'productTypeSites')
                    .leftJoinAndSelect('type.products', 'products')
                    .where('type.id = :id', { id: id })
                    .getOne();
                let productTypeSites = type.productTypeSites;
                let products = type.products;
                if (productTypeSites.length > 0) {
                    for (let i = 0; i < productTypeSites.length; i++) {
                        let productTypeSite = yield tem.createQueryBuilder()
                            .select('typeSite')
                            .from(ProductTypeSite_1.ProductTypeSite, 'typeSite')
                            .leftJoinAndSelect('typeSite.productSites', 'productSites')
                            .where('typeSite.id = :id', { id: productTypeSites[i].id })
                            .getOne();
                        let productSites = productTypeSite.productSites;
                        if (productSites.length > 0) {
                            yield tem.remove(productSites);
                        }
                    }
                    yield tem.remove(productTypeSites);
                }
                if (products.length > 0) {
                    yield tem.remove(products);
                }
                yield tem.remove(type);
            }));
        });
    }
}
exports.CProductTypes = CProductTypes;
//# sourceMappingURL=CProductTypes.js.map
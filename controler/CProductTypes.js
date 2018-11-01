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
    static setOnSale(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            yield ProductType_1.ProductType.update(id, { onSale: !onSale });
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.ProductType.findByName(name);
        });
    }
    static editInfo(type, info) {
        return __awaiter(this, void 0, void 0, function* () {
            type.name = info.name;
            type.onSale = info.onSale;
            return yield type.save();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = new ProductType_1.ProductType();
            type.name = info.name;
            type.onSale = info.onSale;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                type = yield type.save();
                let sites = yield Site_1.Site.all();
                console.log(sites.length, '========================================');
                if (sites.length > 0) {
                    console.log('1111111111111111111111111111111111111');
                    for (let i = 0; i < sites.length; i++) {
                        let site = sites[i];
                        let typeSite = new ProductTypeSite_1.ProductTypeSite();
                        typeSite.type = ProductTypeBase_1.WitchType.Platform;
                        typeSite.name = type.name;
                        typeSite.onSale = type.onSale;
                        typeSite.productType = type;
                        typeSite.site = site;
                        typeSite = yield typeSite.save();
                        console.log(JSON.stringify(typeSite), '---------------------------------   -----');
                    }
                }
            }));
            return type;
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CProductTypes.editInfo(yield ProductType_1.ProductType.findById(info.id), info);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.ProductType.delById(id);
        });
    }
}
exports.CProductTypes = CProductTypes;
//# sourceMappingURL=CProductTypes.js.map
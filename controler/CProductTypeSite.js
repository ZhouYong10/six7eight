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
const ProductTypeSite_1 = require("../entity/ProductTypeSite");
class CProductTypeSite {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.ProductTypeSite.getAll();
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.ProductTypeSite.findByName(name);
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
            return yield CProductTypeSite.editInfo(new ProductTypeSite_1.ProductTypeSite(), info);
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CProductTypeSite.editInfo(yield ProductTypeSite_1.ProductTypeSite.findById(info.id), info);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.ProductTypeSite.delById(id);
        });
    }
}
exports.CProductTypeSite = CProductTypeSite;
//# sourceMappingURL=CProductTypeSite.js.map
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
const ProductField_1 = require("../entity/ProductField");
class CProductField {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.ProductField.getAll();
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.ProductField.findByName(name);
        });
    }
    static editInfo(field, info) {
        return __awaiter(this, void 0, void 0, function* () {
            field.name = info.name;
            field.type = info.type;
            return field;
        });
    }
    static add(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let field = yield CProductField.editInfo(new ProductField_1.ProductField(), info);
            field = yield field.save();
            io.emit('addField', field);
        });
    }
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let field = yield CProductField.editInfo(yield ProductField_1.ProductField.findById(info.id), info);
            field = yield field.save();
            io.emit('updateField', field);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ProductField_1.ProductField.delById(id);
        });
    }
}
exports.CProductField = CProductField;
//# sourceMappingURL=CProductField.js.map
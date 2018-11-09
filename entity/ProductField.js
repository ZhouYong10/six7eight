"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var ProductField_1;
"use strict";
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
let ProductField = ProductField_1 = class ProductField {
    static p() {
        return typeorm_1.getRepository(ProductField_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.p().save(this);
        });
    }
    static query(name) {
        return ProductField_1.p().createQueryBuilder(name);
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.query('field')
                .orderBy('field.createTime', 'DESC')
                .getMany();
        });
    }
    static getAllOn() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.query('field')
                .where('field.onSale = :onSale', { onSale: true })
                .orderBy('field.createTime', 'DESC')
                .getMany();
        });
    }
    static update(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.p().update(id, type);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.p().delete(id);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductField_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProductField.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamp',
        transformer: { from(dVal) {
                return utils_1.myDateFromat(dVal);
            }, to(eVal) {
                return eVal;
            } },
        readonly: true
    }),
    __metadata("design:type", String)
], ProductField.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        unique: true
    }),
    __metadata("design:type", String)
], ProductField.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        unique: true
    }),
    __metadata("design:type", String)
], ProductField.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], ProductField.prototype, "onSale", void 0);
ProductField = ProductField_1 = __decorate([
    typeorm_1.Entity()
], ProductField);
exports.ProductField = ProductField;
//# sourceMappingURL=ProductField.js.map
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
var ProductType_1;
"use strict";
const typeorm_1 = require("typeorm");
const ProductTypeBase_1 = require("./ProductTypeBase");
const Product_1 = require("./Product");
const ProductTypeSite_1 = require("./ProductTypeSite");
const OrderUser_1 = require("./OrderUser");
let ProductType = ProductType_1 = class ProductType extends ProductTypeBase_1.ProductTypeBase {
    static p() {
        return typeorm_1.getRepository(ProductType_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.p().save(this);
        });
    }
    static query(name) {
        return ProductType_1.p().createQueryBuilder(name);
    }
    static getAll(productTypeIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productTypeIds.length < 1) {
                productTypeIds = [''];
            }
            return yield ProductType_1.query('type')
                .whereInIds(productTypeIds)
                .orderBy('type.sortNum', 'ASC')
                .addOrderBy('type.createTime', 'ASC')
                .getMany();
        });
    }
    static allWithProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.query('type')
                .leftJoinAndSelect('type.products', 'products')
                .orderBy('type.sortNum', 'ASC')
                .addOrderBy('type.createTime', 'ASC')
                .getMany();
        });
    }
    static update(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.p().update(id, type);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 50,
        unique: true
    }),
    __metadata("design:type", String)
], ProductType.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProductTypeSite_1.ProductTypeSite, productTypeSite => productTypeSite.productType),
    __metadata("design:type", Array)
], ProductType.prototype, "productTypeSites", void 0);
__decorate([
    typeorm_1.OneToMany(type => Product_1.Product, product => product.productType),
    __metadata("design:type", Array)
], ProductType.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrderUser_1.OrderUser, orderUser => orderUser.productType),
    __metadata("design:type", Array)
], ProductType.prototype, "orders", void 0);
ProductType = ProductType_1 = __decorate([
    typeorm_1.Entity()
], ProductType);
exports.ProductType = ProductType;
//# sourceMappingURL=ProductType.js.map
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
var Product_1;
"use strict";
const typeorm_1 = require("typeorm");
const ProductBase_1 = require("./ProductBase");
const ProductType_1 = require("./ProductType");
const ProductSite_1 = require("./ProductSite");
let Product = Product_1 = class Product extends ProductBase_1.ProductBase {
    static p() {
        return typeorm_1.getRepository(Product_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.p().save(this);
        });
    }
    static query(name) {
        return Product_1.p().createQueryBuilder(name);
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.query('product')
                .leftJoinAndSelect('product.productType', 'type')
                .orderBy('product.productType', 'DESC')
                .addOrderBy('product.createTime', 'DESC')
                .getMany();
        });
    }
    static update(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.p().update(id, product);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.p().delete(id);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    }),
    __metadata("design:type", Number)
], Product.prototype, "sitePrice", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProductSite_1.ProductSite, productSite => productSite.product),
    __metadata("design:type", Array)
], Product.prototype, "productSites", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductType_1.ProductType, productType => productType.products),
    __metadata("design:type", ProductType_1.ProductType)
], Product.prototype, "productType", void 0);
Product = Product_1 = __decorate([
    typeorm_1.Entity()
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map
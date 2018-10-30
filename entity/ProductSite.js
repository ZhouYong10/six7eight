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
var ProductSite_1;
"use strict";
const typeorm_1 = require("typeorm");
const ProductBase_1 = require("./ProductBase");
const Site_1 = require("./Site");
const ProductTypeSite_1 = require("./ProductTypeSite");
const Product_1 = require("./Product");
let ProductSite = ProductSite_1 = class ProductSite extends ProductBase_1.ProductBase {
    static p() {
        return typeorm_1.getRepository(ProductSite_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.p().save(this);
        });
    }
    static query(name) {
        return ProductSite_1.p().createQueryBuilder(name);
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.query('product')
                .leftJoinAndSelect('product.productTypeSite', 'type')
                .orderBy('product.productTypeSite', 'DESC')
                .addOrderBy('product.createTime', 'DESC')
                .getMany();
        });
    }
    static update(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.p().update(id, product);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.p().delete(id);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.ManyToOne(type => Product_1.Product, product => product.productSites),
    __metadata("design:type", Product_1.Product)
], ProductSite.prototype, "product", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.products),
    __metadata("design:type", Site_1.Site)
], ProductSite.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductTypeSite_1.ProductTypeSite, productTypeSite => productTypeSite.productSites),
    __metadata("design:type", ProductTypeSite_1.ProductTypeSite)
], ProductSite.prototype, "productTypeSite", void 0);
ProductSite = ProductSite_1 = __decorate([
    typeorm_1.Entity()
], ProductSite);
exports.ProductSite = ProductSite;
//# sourceMappingURL=ProductSite.js.map
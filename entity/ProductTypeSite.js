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
var ProductTypeSite_1;
"use strict";
const typeorm_1 = require("typeorm");
const ProductTypeBase_1 = require("./ProductTypeBase");
const Site_1 = require("./Site");
const ProductSite_1 = require("./ProductSite");
const ProductType_1 = require("./ProductType");
const OrderUser_1 = require("./OrderUser");
let ProductTypeSite = ProductTypeSite_1 = class ProductTypeSite extends ProductTypeBase_1.ProductTypeBase {
    constructor() {
        super(...arguments);
        this.type = ProductTypeBase_1.WitchType.Site;
    }
    static p() {
        return typeorm_1.getRepository(ProductTypeSite_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.p().save(this);
        });
    }
    static query(name) {
        return ProductTypeSite_1.p().createQueryBuilder(name);
    }
    static getAll(productTypeIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productTypeIds.length < 1) {
                productTypeIds = [''];
            }
            return yield ProductTypeSite_1.query('type')
                .whereInIds(productTypeIds)
                .orderBy('type.sortNum', 'ASC')
                .addOrderBy('type.createTime', 'ASC')
                .getMany();
        });
    }
    static allWithProducts(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.query('type')
                .innerJoin('type.site', 'site', 'site.id = :id', { id: siteId })
                .leftJoinAndSelect('type.productSites', 'product')
                .orderBy('type.sortNum', 'ASC')
                .addOrderBy('type.createTime', 'ASC')
                .addOrderBy('product.sortNum', 'ASC')
                .addOrderBy('product.createTime', 'ASC')
                .getMany();
        });
    }
    static update(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.p().update(id, type);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.p().findOne(id);
        });
    }
    ;
    static findByIdWithProductType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.query('type')
                .where('type.id = :id', { id: id })
                .innerJoinAndSelect('type.productType', 'productType')
                .getOne();
        });
    }
    static findByIdWithProducts(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.query('type')
                .where('type.id = :id', { id: id })
                .innerJoinAndSelect('type.productSites', 'productSites')
                .getOne();
        });
    }
};
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: ProductTypeBase_1.WitchType
    }),
    __metadata("design:type", String)
], ProductTypeSite.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductType_1.ProductType, productType => productType.productTypeSites),
    __metadata("design:type", ProductType_1.ProductType)
], ProductTypeSite.prototype, "productType", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.productTypesSite),
    __metadata("design:type", Site_1.Site)
], ProductTypeSite.prototype, "site", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProductSite_1.ProductSite, productSite => productSite.productTypeSite),
    __metadata("design:type", Array)
], ProductTypeSite.prototype, "productSites", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrderUser_1.OrderUser, orderUser => orderUser.productTypeSite),
    __metadata("design:type", Array)
], ProductTypeSite.prototype, "orders", void 0);
ProductTypeSite = ProductTypeSite_1 = __decorate([
    typeorm_1.Entity()
], ProductTypeSite);
exports.ProductTypeSite = ProductTypeSite;
//# sourceMappingURL=ProductTypeSite.js.map
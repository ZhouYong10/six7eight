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
const ProductTypeBase_1 = require("./ProductTypeBase");
const OrderUser_1 = require("./OrderUser");
const RoleUser_1 = require("./RoleUser");
let ProductSite = ProductSite_1 = class ProductSite extends ProductBase_1.ProductBase {
    constructor() {
        super(...arguments);
        this.type = ProductTypeBase_1.WitchType.Site;
    }
    getPriceByUserRole(roleType) {
        let price;
        switch (roleType) {
            case RoleUser_1.RoleType.Top:
                price = this.topPrice;
                break;
            case RoleUser_1.RoleType.Super:
                price = this.superPrice;
                break;
            default:
                price = this.goldPrice;
        }
        return price;
    }
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
    static getAll(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return yield ProductSite_1.query('product')
                .whereInIds(productIds)
                .leftJoinAndSelect('product.productTypeSite', 'type')
                .orderBy('product.productTypeSite', 'ASC')
                .addOrderBy('product.sortNum', 'ASC')
                .addOrderBy('product.createTime', 'ASC')
                .getMany();
        });
    }
    static getByTypeId(productIds, typeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return yield ProductSite_1.query('product')
                .where('product.id IN (:productIds)', { productIds: productIds })
                .andWhere('product.productTypeSiteId = :typeId', { typeId: typeId })
                .leftJoinAndSelect('product.productTypeSite', 'type')
                .orderBy('product.sortNum', 'ASC')
                .addOrderBy('product.createTime', 'ASC')
                .getMany();
        });
    }
    static getSiteSelf(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return yield ProductSite_1.query('product')
                .where('product.id IN (:productIds)', { productIds: productIds })
                .andWhere('product.type = :type', { type: ProductTypeBase_1.WitchType.Site })
                .leftJoinAndSelect('product.productTypeSite', 'type')
                .orderBy('product.productTypeSite', 'ASC')
                .addOrderBy('product.sortNum', 'ASC')
                .addOrderBy('product.createTime', 'ASC')
                .getMany();
        });
    }
    static getPlatform(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return yield ProductSite_1.query('product')
                .where('product.id IN (:productIds)', { productIds: productIds })
                .andWhere('product.type = :type', { type: ProductTypeBase_1.WitchType.Platform })
                .leftJoinAndSelect('product.productTypeSite', 'type')
                .orderBy('product.productTypeSite', 'ASC')
                .addOrderBy('product.sortNum', 'ASC')
                .addOrderBy('product.createTime', 'ASC')
                .getMany();
        });
    }
    static update(id, product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.p().update(id, product);
        });
    }
    static findByNameAndTypeId(typeId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.query('product')
                .innerJoin('product.productTypeSite', 'productTypeSite', 'productTypeSite.id = :typeId', { typeId: typeId })
                .where('product.name = :name', { name: name })
                .getOne();
        });
    }
    ;
    static getPrototypeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield ProductSite_1.query('product')
                .where('product.id = :id', { id: id })
                .innerJoinAndSelect('product.product', 'prototype')
                .getOne();
            return result.product;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.p().findOne(id, { relations: ['productTypeSite', 'product'] });
        });
    }
    ;
    static getAllOnSale(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.query('product')
                .innerJoin('product.site', 'site', 'site.id = :id', { id: siteId })
                .innerJoin('product.productTypeSite', 'productTypeSite')
                .where('product.onSale = :onSale', { onSale: true })
                .andWhere('productTypeSite.onSale = :isSale', { isSale: true })
                .getMany();
        });
    }
};
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 6,
        scale: 4,
        nullable: true
    }),
    __metadata("design:type", Number)
], ProductSite.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: ProductTypeBase_1.WitchType
    }),
    __metadata("design:type", String)
], ProductSite.prototype, "type", void 0);
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
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ProductSite.prototype, "productTypeSiteId", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrderUser_1.OrderUser, orderUser => orderUser.productSite),
    __metadata("design:type", Array)
], ProductSite.prototype, "orders", void 0);
ProductSite = ProductSite_1 = __decorate([
    typeorm_1.Entity()
], ProductSite);
exports.ProductSite = ProductSite;
//# sourceMappingURL=ProductSite.js.map
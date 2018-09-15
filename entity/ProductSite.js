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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const ProductBase_1 = require("./ProductBase");
const Site_1 = require("./Site");
const ProductTypeSite_1 = require("./ProductTypeSite");
let ProductSite = class ProductSite extends ProductBase_1.ProductBase {
};
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.products),
    __metadata("design:type", Site_1.Site)
], ProductSite.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductTypeSite_1.ProductTypeSite, productTypeSite => productTypeSite.productSites),
    __metadata("design:type", ProductTypeSite_1.ProductTypeSite)
], ProductSite.prototype, "productTypeSite", void 0);
ProductSite = __decorate([
    typeorm_1.Entity()
], ProductSite);
exports.ProductSite = ProductSite;
//# sourceMappingURL=ProductSite.js.map
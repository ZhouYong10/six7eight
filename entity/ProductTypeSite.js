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
const ProductTypeBase_1 = require("./ProductTypeBase");
const Site_1 = require("./Site");
const ProductSite_1 = require("./ProductSite");
let ProductTypeSite = class ProductTypeSite extends ProductTypeBase_1.ProductTypeBase {
};
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.productTypesSite),
    __metadata("design:type", Site_1.Site)
], ProductTypeSite.prototype, "site", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProductSite_1.ProductSite, productSite => productSite.productTypeSite),
    __metadata("design:type", Array)
], ProductTypeSite.prototype, "productSites", void 0);
ProductTypeSite = __decorate([
    typeorm_1.Entity()
], ProductTypeSite);
exports.ProductTypeSite = ProductTypeSite;
//# sourceMappingURL=ProductTypeSite.js.map
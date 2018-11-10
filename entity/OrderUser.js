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
const ConsumeUser_1 = require("./ConsumeUser");
const ProfitUser_1 = require("./ProfitUser");
const ProfitSite_1 = require("./ProfitSite");
const utils_1 = require("../utils");
const Site_1 = require("./Site");
const User_1 = require("./User");
const ProductSite_1 = require("./ProductSite");
const ProductTypeSite_1 = require("./ProductTypeSite");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Wait"] = "order_wait";
    OrderStatus["Execute"] = "order_execute";
    OrderStatus["Finish"] = "order_finish";
    OrderStatus["Refund"] = "order_refund";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
let OrderUser = class OrderUser {
    constructor() {
        this.progress = 0;
        this.status = OrderStatus.Wait;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OrderUser.prototype, "id", void 0);
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
], OrderUser.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        transformer: { from(dVal) {
                return utils_1.myDateFromat(dVal);
            }, to(eVal) {
                return eVal;
            } },
        nullable: true
    }),
    __metadata("design:type", String)
], OrderUser.prototype, "dealTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        transformer: { from(dVal) {
                return utils_1.myDateFromat(dVal);
            }, to(eVal) {
                return eVal;
            } },
        nullable: true
    }),
    __metadata("design:type", String)
], OrderUser.prototype, "finishTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "price", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "startNum", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderUser.prototype, "num", void 0);
__decorate([
    typeorm_1.Column('simple-json'),
    __metadata("design:type", Array)
], OrderUser.prototype, "fields", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "totalPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 3,
        scale: 1
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "progress", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: OrderStatus
    }),
    __metadata("design:type", String)
], OrderUser.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "profitToSuper", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "profitToTop", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "profitToSite", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "profitToPlatform", void 0);
__decorate([
    typeorm_1.OneToMany(type => ConsumeUser_1.ConsumeUser, consumeUser => consumeUser.order),
    __metadata("design:type", Array)
], OrderUser.prototype, "consumes", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.ordersUser),
    __metadata("design:type", Site_1.Site)
], OrderUser.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.orders),
    __metadata("design:type", User_1.User)
], OrderUser.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductTypeSite_1.ProductTypeSite, productTypeSite => productTypeSite.orders),
    __metadata("design:type", ProductTypeSite_1.ProductTypeSite)
], OrderUser.prototype, "productType", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductSite_1.ProductSite, productSite => productSite.orders),
    __metadata("design:type", ProductSite_1.ProductSite)
], OrderUser.prototype, "product", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProfitUser_1.ProfitUser, profitUser => profitUser.order),
    __metadata("design:type", Array)
], OrderUser.prototype, "profitsUser", void 0);
__decorate([
    typeorm_1.OneToOne(type => ProfitSite_1.ProfitSite, profitSite => profitSite.order),
    typeorm_1.JoinColumn(),
    __metadata("design:type", ProfitSite_1.ProfitSite)
], OrderUser.prototype, "profitSite", void 0);
OrderUser = __decorate([
    typeorm_1.Entity()
], OrderUser);
exports.OrderUser = OrderUser;
//# sourceMappingURL=OrderUser.js.map
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
const User_1 = require("./User");
const UserSite_1 = require("./UserSite");
const FeedbackUser_1 = require("./FeedbackUser");
const FeedbackUserSite_1 = require("./FeedbackUserSite");
const PlacardUser_1 = require("./PlacardUser");
const ProductSite_1 = require("./ProductSite");
const ProfitSite_1 = require("./ProfitSite");
const RechargeUser_1 = require("./RechargeUser");
const WithdrawUser_1 = require("./WithdrawUser");
const WithdrawUserSite_1 = require("./WithdrawUserSite");
const RechargeUserSite_1 = require("./RechargeUserSite");
const utils_1 = require("../utils");
var SiteFrontLayout;
(function (SiteFrontLayout) {
    SiteFrontLayout["Normal"] = "normal";
})(SiteFrontLayout = exports.SiteFrontLayout || (exports.SiteFrontLayout = {}));
var SiteBackLayout;
(function (SiteBackLayout) {
    SiteBackLayout["Normal"] = "normal";
})(SiteBackLayout = exports.SiteBackLayout || (exports.SiteBackLayout = {}));
let Site = class Site {
    constructor() {
        this.frontLayout = SiteFrontLayout.Normal;
        this.backLayout = SiteBackLayout.Normal;
        this.createTime = utils_1.now();
        this.userFunds = 0;
        this.userFreezeFunds = 0;
        this.funds = 0;
        this.freezeFunds = 0;
        this.profit = 0;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Site.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 50
    }),
    __metadata("design:type", String)
], Site.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-array",
        nullable: true
    }),
    __metadata("design:type", Array)
], Site.prototype, "seoKey", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 1000,
        nullable: true
    }),
    __metadata("design:type", String)
], Site.prototype, "descriptio", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 16,
        nullable: true
    }),
    __metadata("design:type", String)
], Site.prototype, "qq", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 14,
        nullable: true
    }),
    __metadata("design:type", String)
], Site.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 18,
        nullable: true
    }),
    __metadata("design:type", String)
], Site.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 18,
        nullable: true
    }),
    __metadata("design:type", String)
], Site.prototype, "weixin", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: SiteFrontLayout
    }),
    __metadata("design:type", String)
], Site.prototype, "frontLayout", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: SiteBackLayout
    }),
    __metadata("design:type", String)
], Site.prototype, "backLayout", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 20,
        readonly: true
    }),
    __metadata("design:type", Object)
], Site.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Site.prototype, "logo", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], Site.prototype, "userFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], Site.prototype, "userFreezeFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], Site.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], Site.prototype, "freezeFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], Site.prototype, "profit", void 0);
__decorate([
    typeorm_1.OneToMany(type => User_1.User, user => user.site),
    __metadata("design:type", Array)
], Site.prototype, "users", void 0);
__decorate([
    typeorm_1.OneToMany(type => UserSite_1.UserSite, userSite => userSite.site),
    __metadata("design:type", Array)
], Site.prototype, "usersSite", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUser_1.FeedbackUser, feedbackUser => feedbackUser.site),
    __metadata("design:type", Array)
], Site.prototype, "feedbacksUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUserSite_1.FeedbackUserSite, feedbackUserSite => feedbackUserSite.site),
    __metadata("design:type", Array)
], Site.prototype, "feedbacksUserSite", void 0);
__decorate([
    typeorm_1.OneToMany(type => PlacardUser_1.PlacardUser, placardUser => placardUser.site),
    __metadata("design:type", Array)
], Site.prototype, "placards", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProductSite_1.ProductSite, productSite => productSite.site),
    __metadata("design:type", Array)
], Site.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProfitSite_1.ProfitSite, profitSite => profitSite.site),
    __metadata("design:type", Array)
], Site.prototype, "profits", void 0);
__decorate([
    typeorm_1.OneToMany(type => RechargeUser_1.RechargeUser, rechargeUser => rechargeUser.site),
    __metadata("design:type", Array)
], Site.prototype, "rechargesUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => RechargeUserSite_1.RechargeUserSite, rechargeUserSite => rechargeUserSite.site),
    __metadata("design:type", Array)
], Site.prototype, "rechargesUserSite", void 0);
__decorate([
    typeorm_1.OneToMany(type => WithdrawUser_1.WithdrawUser, withdrawUser => withdrawUser.site),
    __metadata("design:type", Array)
], Site.prototype, "withdrawsUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => WithdrawUserSite_1.WithdrawUserSite, withdrawUserSite => withdrawUserSite.site),
    __metadata("design:type", Array)
], Site.prototype, "withdrawsUserSite", void 0);
Site = __decorate([
    typeorm_1.Entity()
], Site);
exports.Site = Site;
//# sourceMappingURL=Site.js.map
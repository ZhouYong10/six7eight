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
var Site_1;
"use strict";
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const UserSite_1 = require("./UserSite");
const FeedbackUser_1 = require("./FeedbackUser");
const FeedbackUserSite_1 = require("./FeedbackUserSite");
const PlacardUser_1 = require("./PlacardUser");
const ProductSite_1 = require("./ProductSite");
const Recharge_1 = require("./Recharge");
const utils_1 = require("../utils");
const RoleUser_1 = require("./RoleUser");
const RoleUserSite_1 = require("./RoleUserSite");
const ProductTypeSite_1 = require("./ProductTypeSite");
const RechargeCode_1 = require("./RechargeCode");
const Withdraw_1 = require("./Withdraw");
const OrderUser_1 = require("./OrderUser");
const ErrorOrderUser_1 = require("./ErrorOrderUser");
const FundsRecordSite_1 = require("./FundsRecordSite");
const PlacardUserSite_1 = require("./PlacardUserSite");
var SiteFrontLayout;
(function (SiteFrontLayout) {
    SiteFrontLayout["Normal"] = "normal";
})(SiteFrontLayout = exports.SiteFrontLayout || (exports.SiteFrontLayout = {}));
var SiteBackLayout;
(function (SiteBackLayout) {
    SiteBackLayout["Normal"] = "normal";
})(SiteBackLayout = exports.SiteBackLayout || (exports.SiteBackLayout = {}));
let Site = Site_1 = class Site {
    constructor() {
        this.frontLayout = SiteFrontLayout.Normal;
        this.backLayout = SiteBackLayout.Normal;
        this.userFunds = 0;
        this.userFreezeFunds = 0;
        this.funds = 0;
        this.freezeFunds = 0;
        this.profit = 0;
        this.canRegister = true;
    }
    getRoleUpPriceByRoleType(type) {
        utils_1.assert(type !== RoleUser_1.RoleType.Top, '你已是最高等级代理，无法再升级');
        return type === RoleUser_1.RoleType.Gold ? this.goldUpPrice : this.superUpPrice;
    }
    static p() {
        return typeorm_1.getRepository(Site_1);
    }
    static query(name) {
        return Site_1.p().createQueryBuilder(name);
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.query('site')
                .orderBy('site.createTime', 'DESC')
                .getMany();
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.p().save(this);
        });
    }
    static findByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.p().findOne({ address: address });
        });
    }
    ;
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.p().findOne(id);
        });
    }
    ;
    static getUserPlacardsByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.query('site')
                .where('site.address = :address', { address: address })
                .leftJoinAndSelect('site.placards', 'sitePlacard')
                .leftJoinAndSelect('site.platformPlacards', 'platformPlacard', 'platformPlacard.userSee = :userSee', { userSee: true })
                .getOne();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Site.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 50,
        unique: true
    }),
    __metadata("design:type", String)
], Site.prototype, "address", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 50,
        unique: true
    }),
    __metadata("design:type", String)
], Site.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-array",
        nullable: true
    }),
    __metadata("design:type", String)
], Site.prototype, "seoKey", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 1000,
        nullable: true
    }),
    __metadata("design:type", String)
], Site.prototype, "description", void 0);
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
        length: 38,
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
], Site.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true
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
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Site.prototype, "canRegister", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Site.prototype, "goldUpPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Site.prototype, "superUpPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 3,
        scale: 2
    }),
    __metadata("design:type", Number)
], Site.prototype, "upperRatio", void 0);
__decorate([
    typeorm_1.OneToMany(type => FundsRecordSite_1.FundsRecordSite, fundsRecord => fundsRecord.site),
    __metadata("design:type", Array)
], Site.prototype, "fundsRecords", void 0);
__decorate([
    typeorm_1.OneToMany(type => User_1.User, user => user.site),
    __metadata("design:type", Array)
], Site.prototype, "users", void 0);
__decorate([
    typeorm_1.OneToMany(type => UserSite_1.UserSite, userSite => userSite.site),
    __metadata("design:type", Array)
], Site.prototype, "usersSite", void 0);
__decorate([
    typeorm_1.OneToMany(type => RoleUser_1.RoleUser, roleUser => roleUser.site),
    __metadata("design:type", Array)
], Site.prototype, "rolesUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => RoleUserSite_1.RoleUserSite, roleUserSite => roleUserSite.site),
    __metadata("design:type", Array)
], Site.prototype, "rolesUserSite", void 0);
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
    typeorm_1.ManyToMany(type => PlacardUserSite_1.PlacardUserSite, placardUserSite => placardUserSite.sites),
    __metadata("design:type", Array)
], Site.prototype, "platformPlacards", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProductTypeSite_1.ProductTypeSite, productTypeSite => productTypeSite.site),
    __metadata("design:type", Array)
], Site.prototype, "productTypesSite", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProductSite_1.ProductSite, productSite => productSite.site),
    __metadata("design:type", Array)
], Site.prototype, "products", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrderUser_1.OrderUser, orderUser => orderUser.site),
    __metadata("design:type", Array)
], Site.prototype, "ordersUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => ErrorOrderUser_1.ErrorOrderUser, errorOrderUser => errorOrderUser.site),
    __metadata("design:type", Array)
], Site.prototype, "errorsOrderUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => Recharge_1.Recharge, recharge => recharge.site),
    __metadata("design:type", Array)
], Site.prototype, "recharges", void 0);
__decorate([
    typeorm_1.OneToMany(type => RechargeCode_1.RechargeCode, rechargeCode => rechargeCode.site),
    __metadata("design:type", Array)
], Site.prototype, "rechargeCodes", void 0);
__decorate([
    typeorm_1.OneToMany(type => Withdraw_1.Withdraw, withdraw => withdraw.site),
    __metadata("design:type", Array)
], Site.prototype, "withdraws", void 0);
Site = Site_1 = __decorate([
    typeorm_1.Entity()
], Site);
exports.Site = Site;
//# sourceMappingURL=Site.js.map
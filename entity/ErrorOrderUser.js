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
var ErrorOrderUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const UserSite_1 = require("./UserSite");
const UserAdmin_1 = require("./UserAdmin");
const OrderUser_1 = require("./OrderUser");
const ProductTypeBase_1 = require("./ProductTypeBase");
const Site_1 = require("./Site");
let ErrorOrderUser = ErrorOrderUser_1 = class ErrorOrderUser {
    constructor() {
        this.isDeal = false;
    }
    static p() {
        return typeorm_1.getRepository(ErrorOrderUser_1);
    }
    static query(name) {
        return ErrorOrderUser_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.p().save(this);
        });
    }
    static platformAll(productIds, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return ErrorOrderUser_1.query('error')
                .where({ productId: typeorm_1.In(productIds) })
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('error.userAdmin', 'user')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('error.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static getWaitCount(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return ErrorOrderUser_1.query('error')
                .where({ productId: typeorm_1.In(productIds) })
                .andWhere('error.isDeal = :isDeal', { isDeal: false })
                .getCount();
        });
    }
    static getSiteWaitCount(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return ErrorOrderUser_1.query('error')
                .where({ productId: typeorm_1.In(productIds) })
                .andWhere('error.isDeal = :isDeal', { isDeal: false })
                .getCount();
        });
    }
    static siteAll(productIds, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (productIds.length < 1) {
                productIds = [''];
            }
            return ErrorOrderUser_1.query('error')
                .where({ productId: typeorm_1.In(productIds) })
                .leftJoinAndSelect('error.order', 'order')
                .leftJoinAndSelect('error.userSite', 'user')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('error.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static allByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return ErrorOrderUser_1.query('error')
                .innerJoin('error.order', 'order', 'order.id = :id', { id: orderId })
                .addOrderBy('error.createTime', 'DESC')
                .getMany();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], ErrorOrderUser.prototype, "id", void 0);
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
], ErrorOrderUser.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: ProductTypeBase_1.WitchType
    }),
    __metadata("design:type", String)
], ErrorOrderUser.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ErrorOrderUser.prototype, "productId", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 160,
    }),
    __metadata("design:type", String)
], ErrorOrderUser.prototype, "content", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], ErrorOrderUser.prototype, "isDeal", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 160,
        nullable: true
    }),
    __metadata("design:type", String)
], ErrorOrderUser.prototype, "dealContent", void 0);
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
], ErrorOrderUser.prototype, "dealTime", void 0);
__decorate([
    typeorm_1.ManyToOne(type => OrderUser_1.OrderUser, orderUser => orderUser.errors, {
        onDelete: "CASCADE"
    }),
    __metadata("design:type", OrderUser_1.OrderUser)
], ErrorOrderUser.prototype, "order", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ErrorOrderUser.prototype, "orderId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.errorsOrderUser),
    __metadata("design:type", Site_1.Site)
], ErrorOrderUser.prototype, "site", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], ErrorOrderUser.prototype, "siteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.errorsOrderUser),
    __metadata("design:type", UserSite_1.UserSite)
], ErrorOrderUser.prototype, "userSite", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserAdmin_1.UserAdmin, userAdmin => userAdmin.errorsOrderUser),
    __metadata("design:type", UserAdmin_1.UserAdmin)
], ErrorOrderUser.prototype, "userAdmin", void 0);
ErrorOrderUser = ErrorOrderUser_1 = __decorate([
    typeorm_1.Entity()
], ErrorOrderUser);
exports.ErrorOrderUser = ErrorOrderUser;
//# sourceMappingURL=ErrorOrderUser.js.map
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
var OrderUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const Site_1 = require("./Site");
const User_1 = require("./User");
const Product_1 = require("./Product");
const ProductSite_1 = require("./ProductSite");
const ProductType_1 = require("./ProductType");
const ProductTypeSite_1 = require("./ProductTypeSite");
const ProductTypeBase_1 = require("./ProductTypeBase");
const ErrorOrderUser_1 = require("./ErrorOrderUser");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Wait"] = "\u5F85\u6267\u884C";
    OrderStatus["Execute"] = "\u6267\u884C\u4E2D";
    OrderStatus["Refunded"] = "\u5DF2\u64A4\u9500";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
let OrderUser = OrderUser_1 = class OrderUser {
    constructor() {
        this.realTotalPrice = 0;
        this.executeNum = 0;
        this.status = OrderStatus.Wait;
        this.newErrorDeal = false;
    }
    static p() {
        return typeorm_1.getRepository(OrderUser_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.p().save(this);
        });
    }
    static query(name) {
        return OrderUser_1.p().createQueryBuilder(name);
    }
    static update(id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.p().update(id, order);
        });
    }
    static findByIdPlain(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.p().findOne(id);
        });
    }
    static findByIdWithSite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .where('order.id = :id', { id: id })
                .innerJoinAndSelect('order.site', 'site')
                .getOne();
        });
    }
    ;
    static findUserOrdersByProductId(productId, userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .innerJoin('order.productSite', 'productSite', 'productSite.id = :productId', { productId: productId })
                .innerJoin('order.user', 'user', 'user.id = :userId', { userId: userId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('order.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static findPlatformOrdersByProductId(productId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .innerJoin('order.product', 'product', 'product.id = :id', { id: productId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('order.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static findSiteOrdersByProductId(productId, siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .innerJoin('order.productSite', 'productSite', 'productSite.id = :productId', { productId: productId })
                .innerJoin('order.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('order.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static getWaitCount(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .innerJoin('order.product', 'product', 'product.id = :id', { id: productId })
                .where('order.status = :status', { status: OrderStatus.Wait })
                .getCount();
        });
    }
    static getSiteWaitCount(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .innerJoin('order.productSite', 'productSite', 'productSite.id = :id', { id: productId })
                .where('order.product IS NULL')
                .andWhere('order.status = :status', { status: OrderStatus.Wait })
                .getCount();
        });
    }
    static statisticsOrderPlatform(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .select(['order.name as name', 'COUNT(*) as orderNum', 'SUM(order.num) as totalNum',
                'SUM(order.executeNum) as executeNum', 'SUM(order.totalPrice) as totalFunds',
                'SUM(order.realTotalPrice) as executeFunds'])
                .where(`to_days(order.createTime) = to_days(:date)`, { date: date })
                .andWhere('order.type = :type', { type: ProductTypeBase_1.WitchType.Platform })
                .groupBy('order.name')
                .orderBy('order.name')
                .getRawMany();
        });
    }
    static statisticsOrderFundsPlat(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .select(['order.type as type', 'SUM(order.totalPrice) as totalFunds', 'SUM(realTotalPrice) as realTotalFunds'])
                .where(`to_days(order.createTime) = to_days(:date)`, { date: date })
                .groupBy('order.type')
                .getRawMany();
        });
    }
    static statisticsOrderSite(siteId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .select(['order.name as name', 'COUNT(*) as orderNum', 'SUM(order.num) as totalNum',
                'SUM(order.executeNum) as executeNum', 'SUM(order.totalPrice) as totalFunds',
                'SUM(order.realTotalPrice) as executeFunds'])
                .innerJoin('order.site', 'site', 'site.id = :id', { id: siteId })
                .where(`to_days(order.createTime) = to_days(:date)`, { date: date })
                .groupBy('order.name')
                .orderBy('order.name')
                .getRawMany();
        });
    }
    static statisticsOrderFundsSite(siteId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .select(['order.type as type', 'SUM(order.totalPrice) as totalFunds', 'SUM(realTotalPrice) as realTotalFunds'])
                .innerJoin('order.site', 'site', 'site.id = :id', { id: siteId })
                .where(`to_days(order.createTime) = to_days(:date)`, { date: date })
                .groupBy('order.type')
                .getRawMany();
        });
    }
    static statisticsOrderUser(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.query('order')
                .select(['order.name as name', 'COUNT(*) as orderNum', 'SUM(order.num) as totalNum',
                'SUM(order.executeNum) as executeNum', 'SUM(order.totalPrice) as totalFunds',
                'SUM(order.realTotalPrice) as executeFunds'])
                .innerJoin('order.user', 'user', 'user.id = :id', { id: userId })
                .where(`to_days(order.createTime) = to_days(:date)`, { date: date })
                .groupBy('order.name')
                .orderBy('order.name')
                .getRawMany();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OrderUser.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], OrderUser.prototype, "name", void 0);
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
        type: "enum",
        enum: ProductTypeBase_1.WitchType
    }),
    __metadata("design:type", String)
], OrderUser.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderUser.prototype, "speed", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderUser.prototype, "num", void 0);
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
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "totalPrice", void 0);
__decorate([
    typeorm_1.Column('simple-json'),
    __metadata("design:type", Object)
], OrderUser.prototype, "fields", void 0);
__decorate([
    typeorm_1.Column('simple-json'),
    __metadata("design:type", Object)
], OrderUser.prototype, "profits", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "basePrice", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "baseFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "realTotalPrice", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "startNum", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderUser.prototype, "executeNum", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 120,
        nullable: true
    }),
    __metadata("design:type", String)
], OrderUser.prototype, "refundMsg", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: OrderStatus
    }),
    __metadata("design:type", String)
], OrderUser.prototype, "status", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], OrderUser.prototype, "newErrorDeal", void 0);
__decorate([
    typeorm_1.OneToMany(type => ErrorOrderUser_1.ErrorOrderUser, errorOrderUser => errorOrderUser.order),
    __metadata("design:type", Array)
], OrderUser.prototype, "errors", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.ordersUser),
    __metadata("design:type", Site_1.Site)
], OrderUser.prototype, "site", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderUser.prototype, "siteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.orders),
    __metadata("design:type", User_1.User)
], OrderUser.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderUser.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductType_1.ProductType, productType => productType.orders),
    __metadata("design:type", ProductType_1.ProductType)
], OrderUser.prototype, "productType", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderUser.prototype, "productTypeId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Product_1.Product, product => product.orders),
    __metadata("design:type", Product_1.Product)
], OrderUser.prototype, "product", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderUser.prototype, "productId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductTypeSite_1.ProductTypeSite, productTypeSite => productTypeSite.orders),
    __metadata("design:type", ProductTypeSite_1.ProductTypeSite)
], OrderUser.prototype, "productTypeSite", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderUser.prototype, "productTypeSiteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ProductSite_1.ProductSite, productSite => productSite.orders),
    __metadata("design:type", ProductSite_1.ProductSite)
], OrderUser.prototype, "productSite", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], OrderUser.prototype, "productSiteId", void 0);
OrderUser = OrderUser_1 = __decorate([
    typeorm_1.Entity()
], OrderUser);
exports.OrderUser = OrderUser;
//# sourceMappingURL=OrderUser.js.map
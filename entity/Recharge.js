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
var Recharge_1;
"use strict";
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
const User_1 = require("./User");
const RechargeCode_1 = require("./RechargeCode");
var RechargeType;
(function (RechargeType) {
    RechargeType["Site"] = "site_recharge";
    RechargeType["User"] = "user_recharge";
})(RechargeType = exports.RechargeType || (exports.RechargeType = {}));
var RechargeWay;
(function (RechargeWay) {
    RechargeWay["Hand"] = "hand_recharge";
    RechargeWay["Auto"] = "auto_recharge";
})(RechargeWay = exports.RechargeWay || (exports.RechargeWay = {}));
var RechargeState;
(function (RechargeState) {
    RechargeState["Wait"] = "wait_recharge";
    RechargeState["Success"] = "success_recharge";
    RechargeState["Fail"] = "fail_recharge";
})(RechargeState = exports.RechargeState || (exports.RechargeState = {}));
let Recharge = Recharge_1 = class Recharge {
    constructor() {
        this.state = RechargeState.Wait;
    }
    static p() {
        return typeorm_1.getRepository(Recharge_1);
    }
    static query(name) {
        return Recharge_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.p().save(this);
        });
    }
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.query('recharge')
                .where('recharge.way = :way', { way: RechargeWay.Hand })
                .andWhere('recharge.state = :state', { state: RechargeState.Wait })
                .getCount();
        });
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.query('recharge')
                .where('recharge.type IS NOT NULL')
                .leftJoinAndSelect('recharge.site', 'site')
                .leftJoinAndSelect('recharge.user', 'user')
                .leftJoinAndSelect('recharge.userSite', 'userSite')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('recharge.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static userAllRecords(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.query('recharge')
                .innerJoin('recharge.user', 'user', 'user.id = :userId', { userId: userId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('recharge.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static siteAllRecords(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.query('recharge')
                .innerJoin('recharge.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .where('recharge.type = :type', { type: RechargeType.Site })
                .leftJoinAndSelect('recharge.userSite', 'userSite')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('recharge.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static findByAlipayId(alipayId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.p().findOne({ alipayId: alipayId });
        });
    }
    static findHandCommited(alipayId) {
        return __awaiter(this, void 0, void 0, function* () {
            let recharge = yield Recharge_1.findByAlipayId(alipayId);
            if (recharge && (recharge.state !== RechargeState.Wait || recharge.way === RechargeWay.Hand)) {
                return recharge;
            }
            return null;
        });
    }
    static findAutoCommited(alipayId) {
        return __awaiter(this, void 0, void 0, function* () {
            let recharge = yield Recharge_1.findByAlipayId(alipayId);
            if (recharge && (recharge.state === RechargeState.Wait && recharge.way === RechargeWay.Auto)) {
                return recharge;
            }
            return null;
        });
    }
    static update(id, recharge) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.p().update(id, recharge);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.p().delete(id);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.query('recharge')
                .where('recharge.id = :id', { id: id })
                .leftJoinAndSelect('recharge.site', 'site')
                .leftJoinAndSelect('recharge.user', 'user')
                .leftJoinAndSelect('recharge.userSite', 'userSite')
                .getOne();
        });
    }
    ;
    static findByIdOnlyRecharge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.p().findOne(id);
        });
    }
    static platRechargeOfDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.query('recharge')
                .select('SUM(recharge.funds) as rechargeFunds')
                .where(`to_days(recharge.intoAccountTime) = to_days(:date)`, { date: date })
                .andWhere('recharge.state = :state', { state: RechargeState.Success })
                .getRawOne();
        });
    }
    static dayRechargeOfUser(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.query('recharge')
                .select('SUM(recharge.funds) as recharge')
                .innerJoin('recharge.user', 'user', 'user.id = :id', { id: userId })
                .where(`to_days(recharge.intoAccountTime) = to_days(:date)`, { date: date })
                .andWhere('recharge.state = :state', { state: RechargeState.Success })
                .getRawOne();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Recharge.prototype, "id", void 0);
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
], Recharge.prototype, "createTime", void 0);
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
], Recharge.prototype, "intoAccountTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 50,
        unique: true
    }),
    __metadata("design:type", String)
], Recharge.prototype, "alipayId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    }),
    __metadata("design:type", Number)
], Recharge.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    }),
    __metadata("design:type", Number)
], Recharge.prototype, "oldFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    }),
    __metadata("design:type", Number)
], Recharge.prototype, "newFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: RechargeState
    }),
    __metadata("design:type", String)
], Recharge.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true
    }),
    __metadata("design:type", String)
], Recharge.prototype, "failMsg", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: RechargeType,
        nullable: true
    }),
    __metadata("design:type", String)
], Recharge.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: RechargeWay,
        readonly: true
    }),
    __metadata("design:type", String)
], Recharge.prototype, "way", void 0);
__decorate([
    typeorm_1.OneToOne(type => RechargeCode_1.RechargeCode, rechargeCode => rechargeCode.recharge),
    typeorm_1.JoinColumn(),
    __metadata("design:type", RechargeCode_1.RechargeCode)
], Recharge.prototype, "rechargeCode", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.recharges),
    __metadata("design:type", UserSite_1.UserSite)
], Recharge.prototype, "userSite", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Recharge.prototype, "userSiteId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.recharges),
    __metadata("design:type", User_1.User)
], Recharge.prototype, "user", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Recharge.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.recharges),
    __metadata("design:type", Site_1.Site)
], Recharge.prototype, "site", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Recharge.prototype, "siteId", void 0);
Recharge = Recharge_1 = __decorate([
    typeorm_1.Entity()
], Recharge);
exports.Recharge = Recharge;
//# sourceMappingURL=Recharge.js.map
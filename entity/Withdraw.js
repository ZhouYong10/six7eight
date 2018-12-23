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
var Withdraw_1;
"use strict";
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const Site_1 = require("./Site");
const User_1 = require("./User");
const UserSite_1 = require("./UserSite");
var WithdrawState;
(function (WithdrawState) {
    WithdrawState["Wait"] = "wait_withdraw";
    WithdrawState["Success"] = "success_withdraw";
    WithdrawState["Fail"] = "fail_withdraw";
})(WithdrawState = exports.WithdrawState || (exports.WithdrawState = {}));
var WithdrawType;
(function (WithdrawType) {
    WithdrawType["User"] = "user_withdraw";
    WithdrawType["Site"] = "site_withdraw";
})(WithdrawType = exports.WithdrawType || (exports.WithdrawType = {}));
let Withdraw = Withdraw_1 = class Withdraw {
    constructor() {
        this.state = WithdrawState.Wait;
    }
    static p() {
        return typeorm_1.getRepository(Withdraw_1);
    }
    static query(name) {
        return Withdraw_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.p().save(this);
        });
    }
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.query('withdraw')
                .where('withdraw.state = :state', { state: WithdrawState.Wait })
                .getCount();
        });
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.query('withdraw')
                .leftJoinAndSelect('withdraw.site', 'site')
                .leftJoinAndSelect('withdraw.user', 'user')
                .leftJoinAndSelect('withdraw.userSite', 'userSite')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('withdraw.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static userAllRecords(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.query('withdraw')
                .innerJoin('withdraw.user', 'user', 'user.id = :userId', { userId: userId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('withdraw.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static siteAllRecords(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.query('withdraw')
                .innerJoin('withdraw.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .where('withdraw.type = :type', { type: WithdrawType.Site })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .leftJoinAndSelect('withdraw.userSite', 'userSite')
                .orderBy('withdraw.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static update(id, withdraw) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.p().update(id, withdraw);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.p().delete(id);
        });
    }
    static findByIdWithUserAndSite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.query('withdraw')
                .where('withdraw.id = :id', { id: id })
                .leftJoinAndSelect('withdraw.site', 'site')
                .leftJoinAndSelect('withdraw.user', 'user')
                .leftJoinAndSelect('withdraw.userSite', 'userSite')
                .getOne();
        });
    }
    ;
    static findByIdWithUserSite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.p().findOne(id, { relations: ['userSite'] });
        });
    }
    static findByIdPlain(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Withdraw_1.p().findOne(id);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Withdraw.prototype, "id", void 0);
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
], Withdraw.prototype, "createTime", void 0);
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
], Withdraw.prototype, "dealTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "alipayCount", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "alipayName", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Withdraw.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Withdraw.prototype, "oldFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Withdraw.prototype, "newFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: WithdrawState
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "failMsg", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: WithdrawType,
        readonly: true
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.withdraws),
    __metadata("design:type", User_1.User)
], Withdraw.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.withdraws),
    __metadata("design:type", UserSite_1.UserSite)
], Withdraw.prototype, "userSite", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.withdraws),
    __metadata("design:type", Site_1.Site)
], Withdraw.prototype, "site", void 0);
Withdraw = Withdraw_1 = __decorate([
    typeorm_1.Entity()
], Withdraw);
exports.Withdraw = Withdraw;
//# sourceMappingURL=Withdraw.js.map
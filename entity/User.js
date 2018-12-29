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
var User_1;
"use strict";
const typeorm_1 = require("typeorm");
const UserBase_1 = require("./UserBase");
const RoleUser_1 = require("./RoleUser");
const FundsRecordUser_1 = require("./FundsRecordUser");
const Site_1 = require("./Site");
const FeedbackUser_1 = require("./FeedbackUser");
const Recharge_1 = require("./Recharge");
const RechargeCode_1 = require("./RechargeCode");
const Withdraw_1 = require("./Withdraw");
const OrderUser_1 = require("./OrderUser");
const RemarkUser_1 = require("./RemarkUser");
const MessageUser_1 = require("./MessageUser");
let User = User_1 = class User extends UserBase_1.UserBase {
    constructor() {
        super(...arguments);
        this.type = UserBase_1.UserType.User;
        this.funds = 0;
        this.freezeFunds = 0;
    }
    static p() {
        return typeorm_1.getRepository(User_1);
    }
    static query(name) {
        return User_1.p().createQueryBuilder(name);
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.query('user')
                .leftJoinAndSelect('user.parent', 'parent')
                .leftJoinAndSelect('user.role', 'role')
                .loadRelationCountAndMap('user.childNum', 'user.children')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('user.registerTime', 'DESC')
                .cache(10000)
                .getManyAndCount();
        });
    }
    static siteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.query('user')
                .innerJoin('user.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .leftJoinAndSelect('user.role', 'role')
                .leftJoinAndSelect('user.parent', 'parent')
                .loadRelationCountAndMap('user.childNum', 'user.children')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('user.registerTime', 'DESC')
                .cache(10000)
                .getManyAndCount();
        });
    }
    static getAllLowerUser(parentId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.query('user')
                .innerJoin('user.parent', 'parent', 'parent.id = :parentId', { parentId: parentId })
                .leftJoinAndSelect('user.role', 'role')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('user.registerTime', 'DESC')
                .getManyAndCount();
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.p().save(this);
        });
    }
    static update(id, info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.p().update(id, info);
        });
    }
    static findByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.p().findOne({ username: username });
        });
    }
    ;
    static findByNameWithSite(username, siteAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.query('user')
                .leftJoinAndSelect('user.role', 'role')
                .innerJoinAndSelect('user.site', 'site', 'site.address = :address', { address: siteAddress })
                .where('user.username = :username', { username: username })
                .getOne();
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.p().findOne(id);
        });
    }
    ;
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.p().delete(id);
        });
    }
    static getAllStatusInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.query('user')
                .select(['user.state as state', 'COUNT(*) as num'])
                .groupBy('user.state')
                .getRawMany();
        });
    }
    static getAllFunds() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.query('user')
                .select(['SUM(user.funds) as funds', 'SUM(user.freezeFunds) as freezeFunds'])
                .getRawOne();
        });
    }
    static platNewUserOfDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.query('user')
                .where(`to_days(user.registerTime) = to_days(:date)`, { date: date })
                .getCount();
        });
    }
};
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: UserBase_1.UserType,
        readonly: true
    }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], User.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], User.prototype, "freezeFunds", void 0);
__decorate([
    typeorm_1.ManyToOne(type => RoleUser_1.RoleUser, roleUser => roleUser.users, {
        eager: true,
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", RoleUser_1.RoleUser)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.TreeParent(),
    __metadata("design:type", User)
], User.prototype, "parent", void 0);
__decorate([
    typeorm_1.TreeChildren(),
    __metadata("design:type", Array)
], User.prototype, "children", void 0);
__decorate([
    typeorm_1.OneToMany(type => RemarkUser_1.RemarkUser, remarkUser => remarkUser.user),
    __metadata("design:type", Array)
], User.prototype, "remarks", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.users, {
        eager: true,
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", Site_1.Site)
], User.prototype, "site", void 0);
__decorate([
    typeorm_1.OneToMany(type => OrderUser_1.OrderUser, orderUser => orderUser.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    typeorm_1.OneToMany(type => Recharge_1.Recharge, recharge => recharge.user),
    __metadata("design:type", Array)
], User.prototype, "recharges", void 0);
__decorate([
    typeorm_1.OneToMany(type => RechargeCode_1.RechargeCode, rechargeCode => rechargeCode.user),
    __metadata("design:type", Array)
], User.prototype, "rechargeCodes", void 0);
__decorate([
    typeorm_1.OneToMany(type => Withdraw_1.Withdraw, withdraw => withdraw.user),
    __metadata("design:type", Array)
], User.prototype, "withdraws", void 0);
__decorate([
    typeorm_1.OneToMany(type => FundsRecordUser_1.FundsRecordUser, fundsRecord => fundsRecord.user),
    __metadata("design:type", Array)
], User.prototype, "fundsRecords", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUser_1.FeedbackUser, feedbackUser => feedbackUser.user),
    __metadata("design:type", Array)
], User.prototype, "feedbacks", void 0);
__decorate([
    typeorm_1.OneToMany(type => MessageUser_1.MessageUser, messageUser => messageUser.user),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Tree('closure-table')
], User);
exports.User = User;
//# sourceMappingURL=User.js.map
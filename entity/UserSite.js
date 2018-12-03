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
var UserSite_1;
"use strict";
const typeorm_1 = require("typeorm");
const UserBase_1 = require("./UserBase");
const RoleUserSite_1 = require("./RoleUserSite");
const ConsumeSite_1 = require("./ConsumeSite");
const Site_1 = require("./Site");
const FeedbackUserSite_1 = require("./FeedbackUserSite");
const FeedbackUser_1 = require("./FeedbackUser");
const PlacardUser_1 = require("./PlacardUser");
const Recharge_1 = require("./Recharge");
const RechargeCode_1 = require("./RechargeCode");
const Withdraw_1 = require("./Withdraw");
const RemarkUser_1 = require("./RemarkUser");
const ErrorOrderUser_1 = require("./ErrorOrderUser");
let UserSite = UserSite_1 = class UserSite extends UserBase_1.UserBase {
    constructor() {
        super(...arguments);
        this.type = UserBase_1.UserType.Site;
    }
    static p() {
        return typeorm_1.getRepository(UserSite_1);
    }
    static query(name) {
        return UserSite_1.p().createQueryBuilder(name);
    }
    static getAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.query('admin')
                .innerJoin('admin.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .leftJoinAndSelect('admin.role', 'role')
                .orderBy('admin.registerTime', 'DESC')
                .getMany();
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.p().save(this);
        });
    }
    static update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.p().update(id, user);
        });
    }
    static findByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.p().findOne({ username: username });
        });
    }
    ;
    static findByNameWithSite(username, siteAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.query('admin')
                .leftJoinAndSelect('admin.role', 'role')
                .innerJoinAndSelect('admin.site', 'site', 'site.address = :address', { address: siteAddress })
                .where('admin.username = :username', { username: username })
                .getOne();
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.p().findOne(id);
        });
    }
    ;
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.p().delete(id);
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
], UserSite.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => RoleUserSite_1.RoleUserSite, roleUserSite => roleUserSite.users, {
        eager: true,
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", RoleUserSite_1.RoleUserSite)
], UserSite.prototype, "role", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.usersSite, {
        eager: true,
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", Site_1.Site)
], UserSite.prototype, "site", void 0);
__decorate([
    typeorm_1.OneToMany(type => Recharge_1.Recharge, recharge => recharge.userSite),
    __metadata("design:type", Array)
], UserSite.prototype, "recharges", void 0);
__decorate([
    typeorm_1.OneToMany(type => RechargeCode_1.RechargeCode, rechargeCode => rechargeCode.userSite),
    __metadata("design:type", Array)
], UserSite.prototype, "rechargeCodes", void 0);
__decorate([
    typeorm_1.OneToMany(type => Withdraw_1.Withdraw, withdraw => withdraw.userSite),
    __metadata("design:type", Array)
], UserSite.prototype, "withdraws", void 0);
__decorate([
    typeorm_1.OneToMany(type => ConsumeSite_1.ConsumeSite, consumeSite => consumeSite.userSite),
    __metadata("design:type", Array)
], UserSite.prototype, "consumes", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUserSite_1.FeedbackUserSite, feedbackUserSite => feedbackUserSite.user),
    __metadata("design:type", Array)
], UserSite.prototype, "feedbacks", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUser_1.FeedbackUser, feedbackUser => feedbackUser.dealUser),
    __metadata("design:type", Array)
], UserSite.prototype, "dealFeedbacks", void 0);
__decorate([
    typeorm_1.OneToMany(type => PlacardUser_1.PlacardUser, placardUser => placardUser.user),
    __metadata("design:type", Array)
], UserSite.prototype, "placards", void 0);
__decorate([
    typeorm_1.OneToMany(type => RemarkUser_1.RemarkUser, remarkUser => remarkUser.userSite),
    __metadata("design:type", Array)
], UserSite.prototype, "remarksUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => ErrorOrderUser_1.ErrorOrderUser, errorOrderUser => errorOrderUser.userSite),
    __metadata("design:type", Array)
], UserSite.prototype, "errorsOrderUser", void 0);
UserSite = UserSite_1 = __decorate([
    typeorm_1.Entity()
], UserSite);
exports.UserSite = UserSite;
//# sourceMappingURL=UserSite.js.map
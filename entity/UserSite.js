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
const ConsumeUserSite_1 = require("./ConsumeUserSite");
const Site_1 = require("./Site");
const FeedbackUserSite_1 = require("./FeedbackUserSite");
const FeedbackUser_1 = require("./FeedbackUser");
const PlacardUser_1 = require("./PlacardUser");
const RechargeUserSite_1 = require("./RechargeUserSite");
const WithdrawUserSite_1 = require("./WithdrawUserSite");
let UserSite = UserSite_1 = class UserSite extends UserBase_1.UserBase {
    constructor() {
        super(...arguments);
        this.type = UserBase_1.UserType.Site;
    }
    static p() {
        return typeorm_1.getRepository(UserSite_1);
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
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 100
    }),
    __metadata("design:type", String)
], UserSite.prototype, "username", void 0);
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
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.usersSite),
    __metadata("design:type", Site_1.Site)
], UserSite.prototype, "site", void 0);
__decorate([
    typeorm_1.OneToMany(type => RechargeUserSite_1.RechargeUserSite, rechargeUserSite => rechargeUserSite.user),
    __metadata("design:type", Array)
], UserSite.prototype, "recharges", void 0);
__decorate([
    typeorm_1.OneToMany(type => WithdrawUserSite_1.WithdrawUserSite, withdrawUserSite => withdrawUserSite.user),
    __metadata("design:type", Array)
], UserSite.prototype, "withdraws", void 0);
__decorate([
    typeorm_1.OneToMany(type => ConsumeUserSite_1.ConsumeUserSite, consumeUserSite => consumeUserSite.user),
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
UserSite = UserSite_1 = __decorate([
    typeorm_1.Entity()
], UserSite);
exports.UserSite = UserSite;
//# sourceMappingURL=UserSite.js.map
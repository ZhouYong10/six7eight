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
const ConsumeUser_1 = require("./ConsumeUser");
const Site_1 = require("./Site");
const FeedbackUser_1 = require("./FeedbackUser");
const ProfitUser_1 = require("./ProfitUser");
const RechargeUser_1 = require("./RechargeUser");
const WithdrawUser_1 = require("./WithdrawUser");
const ProfitSite_1 = require("./ProfitSite");
let User = User_1 = class User extends UserBase_1.UserBase {
    constructor() {
        super(...arguments);
        this.type = UserBase_1.UserType.User;
        this.funds = 0;
        this.freezeFunds = 0;
        this.profit = 0;
    }
};
User.findByName = (username) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getRepository(User_1).findOne({ username: username });
});
User.findById = (id) => __awaiter(this, void 0, void 0, function* () {
    return yield typeorm_1.getRepository(User_1).findOne(id);
});
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
    typeorm_1.Column({
        type: "decimal",
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], User.prototype, "profit", void 0);
__decorate([
    typeorm_1.ManyToOne(type => RoleUser_1.RoleUser, roleUser => roleUser.users),
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
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.users),
    __metadata("design:type", Site_1.Site)
], User.prototype, "site", void 0);
__decorate([
    typeorm_1.OneToMany(type => RechargeUser_1.RechargeUser, rechargeUser => rechargeUser.user),
    __metadata("design:type", Array)
], User.prototype, "recharges", void 0);
__decorate([
    typeorm_1.OneToMany(type => WithdrawUser_1.WithdrawUser, withdrawUser => withdrawUser.user),
    __metadata("design:type", Array)
], User.prototype, "withdraws", void 0);
__decorate([
    typeorm_1.OneToMany(type => ConsumeUser_1.ConsumeUser, consumeUser => consumeUser.user),
    __metadata("design:type", Array)
], User.prototype, "consumes", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUser_1.FeedbackUser, feedbackUser => feedbackUser.user),
    __metadata("design:type", Array)
], User.prototype, "feedbacks", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProfitSite_1.ProfitSite, profitSite => profitSite.profitUser),
    __metadata("design:type", Array)
], User.prototype, "giveProfitsSite", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProfitUser_1.ProfitUser, profitUser => profitUser.profitUser),
    __metadata("design:type", Array)
], User.prototype, "giveProfitsUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProfitUser_1.ProfitUser, profitUser => profitUser.profitToUser),
    __metadata("design:type", Array)
], User.prototype, "getProfits", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Tree('closure-table')
], User);
exports.User = User;
//# sourceMappingURL=User.js.map
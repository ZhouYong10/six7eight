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
var UserAdmin_1;
"use strict";
const typeorm_1 = require("typeorm");
const UserBase_1 = require("./UserBase");
const FeedbackUserSite_1 = require("./FeedbackUserSite");
const PlacardUserSite_1 = require("./PlacardUserSite");
const RoleUserAdmin_1 = require("./RoleUserAdmin");
const RemarkUser_1 = require("./RemarkUser");
const ErrorOrderUser_1 = require("./ErrorOrderUser");
const FeedbackUser_1 = require("./FeedbackUser");
let UserAdmin = UserAdmin_1 = class UserAdmin extends UserBase_1.UserBase {
    constructor() {
        super(...arguments);
        this.type = UserBase_1.UserType.Platform;
    }
    static p() {
        return typeorm_1.getRepository(UserAdmin_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.p().save(this);
        });
    }
    static query(name) {
        return UserAdmin_1.p().createQueryBuilder(name);
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.query('admin')
                .leftJoinAndSelect('admin.role', 'role')
                .orderBy('admin.registerTime', 'DESC')
                .getMany();
        });
    }
    static update(id, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.p().update(id, admin);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.p().delete(id);
        });
    }
    static findByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.p().findOne({ username: username });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: UserBase_1.UserType,
        readonly: true
    }),
    __metadata("design:type", String)
], UserAdmin.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => RoleUserAdmin_1.RoleUserAdmin, roleUserAdmin => roleUserAdmin.users, {
        eager: true,
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", RoleUserAdmin_1.RoleUserAdmin)
], UserAdmin.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUserSite_1.FeedbackUserSite, feedbackUserSite => feedbackUserSite.dealUser),
    __metadata("design:type", Array)
], UserAdmin.prototype, "dealFeedbacks", void 0);
__decorate([
    typeorm_1.OneToMany(type => FeedbackUser_1.FeedbackUser, feedbackUser => feedbackUser.dealUserAdmin),
    __metadata("design:type", Array)
], UserAdmin.prototype, "dealUserFeedbacks", void 0);
__decorate([
    typeorm_1.OneToMany(type => PlacardUserSite_1.PlacardUserSite, placardUserSite => placardUserSite.user),
    __metadata("design:type", PlacardUserSite_1.PlacardUserSite)
], UserAdmin.prototype, "placards", void 0);
__decorate([
    typeorm_1.OneToMany(type => RemarkUser_1.RemarkUser, remarkUser => remarkUser.userAdmin),
    __metadata("design:type", Array)
], UserAdmin.prototype, "remarksUser", void 0);
__decorate([
    typeorm_1.OneToMany(type => ErrorOrderUser_1.ErrorOrderUser, errorOrderUser => errorOrderUser.userAdmin),
    __metadata("design:type", Array)
], UserAdmin.prototype, "errorsOrderUser", void 0);
UserAdmin = UserAdmin_1 = __decorate([
    typeorm_1.Entity()
], UserAdmin);
exports.UserAdmin = UserAdmin;
//# sourceMappingURL=UserAdmin.js.map
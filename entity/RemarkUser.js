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
var RemarkUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const User_1 = require("./User");
const UserSite_1 = require("./UserSite");
const UserAdmin_1 = require("./UserAdmin");
var RemarkWich;
(function (RemarkWich) {
    RemarkWich["Platform"] = "remark_platform";
    RemarkWich["Site"] = "remark_site";
})(RemarkWich = exports.RemarkWich || (exports.RemarkWich = {}));
let RemarkUser = RemarkUser_1 = class RemarkUser {
    static p() {
        return typeorm_1.getRepository(RemarkUser_1);
    }
    static query(name) {
        return RemarkUser_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RemarkUser_1.p().save(this);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], RemarkUser.prototype, "id", void 0);
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
], RemarkUser.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "varchar",
        length: 300,
    }),
    __metadata("design:type", String)
], RemarkUser.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: RemarkWich,
        readonly: true
    }),
    __metadata("design:type", String)
], RemarkUser.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.remarks),
    __metadata("design:type", User_1.User)
], RemarkUser.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.remarksUser),
    __metadata("design:type", UserSite_1.UserSite)
], RemarkUser.prototype, "userSite", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserAdmin_1.UserAdmin, userAdmin => userAdmin.remarksUser),
    __metadata("design:type", UserAdmin_1.UserAdmin)
], RemarkUser.prototype, "userAdmin", void 0);
RemarkUser = RemarkUser_1 = __decorate([
    typeorm_1.Entity()
], RemarkUser);
exports.RemarkUser = RemarkUser;
//# sourceMappingURL=RemarkUser.js.map
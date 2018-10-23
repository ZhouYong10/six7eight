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
var RechargeCode_1;
"use strict";
const typeorm_1 = require("typeorm");
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
const User_1 = require("./User");
const utils_1 = require("../utils");
const Recharge_1 = require("./Recharge");
let RechargeCode = RechargeCode_1 = class RechargeCode {
    constructor() {
        this.beUsed = false;
    }
    static p() {
        return typeorm_1.getRepository(RechargeCode_1);
    }
    static query(name) {
        return RechargeCode_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RechargeCode_1.p().save(this);
        });
    }
    static getCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'.split('');
            let uuid = [];
            let len = 6;
            let radix = chars.length;
            for (let i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }
            let code = uuid.join('');
            let savedCode = yield RechargeCode_1.findByCode(code);
            if (savedCode) {
                return yield RechargeCode_1.getCode();
            }
            else {
                return code;
            }
        });
    }
    static update(id, rechargeCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RechargeCode_1.p().update(id, rechargeCode);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RechargeCode_1.p().delete(id);
        });
    }
    static findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RechargeCode_1.p().findOne({ code: code });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RechargeCode_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], RechargeCode.prototype, "id", void 0);
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
], RechargeCode.prototype, "createTime", void 0);
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
], RechargeCode.prototype, "usedTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 10,
        unique: true
    }),
    __metadata("design:type", String)
], RechargeCode.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 16
    }),
    __metadata("design:type", String)
], RechargeCode.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], RechargeCode.prototype, "beUsed", void 0);
__decorate([
    typeorm_1.OneToOne(type => Recharge_1.Recharge, recharge => recharge.rechargeCode),
    __metadata("design:type", Recharge_1.Recharge)
], RechargeCode.prototype, "recharge", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.rechargeCodes),
    __metadata("design:type", UserSite_1.UserSite)
], RechargeCode.prototype, "userSite", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.rechargeCodes),
    __metadata("design:type", User_1.User)
], RechargeCode.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.rechargeCodes),
    __metadata("design:type", Site_1.Site)
], RechargeCode.prototype, "site", void 0);
RechargeCode = RechargeCode_1 = __decorate([
    typeorm_1.Entity()
], RechargeCode);
exports.RechargeCode = RechargeCode;
//# sourceMappingURL=RechargeCode.js.map
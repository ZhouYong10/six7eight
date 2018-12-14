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
var FundsRecordUser_1;
"use strict";
const FundsRecordBase_1 = require("./FundsRecordBase");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let FundsRecordUser = FundsRecordUser_1 = class FundsRecordUser extends FundsRecordBase_1.FundsRecordBase {
    static p() {
        return typeorm_1.getRepository(FundsRecordUser_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordUser_1.p().save(this);
        });
    }
    static query(name) {
        return FundsRecordUser_1.p().createQueryBuilder(name);
    }
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return FundsRecordUser_1.query('consume')
                .innerJoin('consume.user', 'user', 'user.id = :id', { id: userId })
                .addOrderBy('consume.createTime', 'DESC')
                .getMany();
        });
    }
    static allProfitByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return FundsRecordUser_1.query('consume')
                .where('consume.type = :type', { type: FundsRecordBase_1.FundsRecordType.Profit })
                .innerJoin('consume.user', 'user', 'user.id = :id', { id: userId })
                .addOrderBy('consume.createTime', 'DESC')
                .getMany();
        });
    }
};
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.fundsRecords),
    __metadata("design:type", User_1.User)
], FundsRecordUser.prototype, "user", void 0);
FundsRecordUser = FundsRecordUser_1 = __decorate([
    typeorm_1.Entity()
], FundsRecordUser);
exports.FundsRecordUser = FundsRecordUser;
//# sourceMappingURL=FundsRecordUser.js.map
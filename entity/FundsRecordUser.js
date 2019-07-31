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
const utils_1 = require("../utils");
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
    static findByUserId(userId, page, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let recordTypes = utils_1.getRecordTypes(type);
            return yield FundsRecordUser_1.query('consume')
                .innerJoin('consume.user', 'user', 'user.id = :id', { id: userId })
                .where('consume.type IN (:types)', { types: recordTypes })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('consume.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static allProfitByUserId(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordUser_1.query('consume')
                .where('consume.type = :type', { type: FundsRecordBase_1.FundsRecordType.Profit })
                .innerJoin('consume.user', 'user', 'user.id = :id', { id: userId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('consume.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static platUpRoleOfDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordUser_1.query('record')
                .where(`to_days(record.createTime) = to_days(:date)`, { date: date })
                .andWhere('record.type = :type', { type: FundsRecordBase_1.FundsRecordType.UpRole })
                .getCount();
        });
    }
    static siteUpRoleOfDay(siteId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordUser_1.query('record')
                .innerJoin('record.user', 'user')
                .innerJoin('user.site', 'site', 'site.id = :id', { id: siteId })
                .where(`to_days(record.createTime) = to_days(:date)`, { date: date })
                .andWhere('record.type = :type', { type: FundsRecordBase_1.FundsRecordType.UpRole })
                .getCount();
        });
    }
    static dayConsumeOfUser(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            let { consume } = yield FundsRecordUser_1.query('record')
                .select(['SUM(record.funds) as consume'])
                .innerJoin('record.user', 'user', 'user.id = :id', { id: userId })
                .where(`to_days(record.createTime) = to_days(:date)`, { date: date })
                .andWhere('record.type IN (:types)', { types: [FundsRecordBase_1.FundsRecordType.Order, FundsRecordBase_1.FundsRecordType.UpRole] })
                .andWhere('record.upOrDown = :upOrDown', { upOrDown: FundsRecordBase_1.FundsUpDown.Minus })
                .getRawOne();
            return consume || 0;
        });
    }
    static dayRefundOfUser(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            let { refund } = yield FundsRecordUser_1.query('record')
                .select(['SUM(record.funds) as refund'])
                .innerJoin('record.user', 'user', 'user.id = :id', { id: userId })
                .where(`to_days(record.createTime) = to_days(:date)`, { date: date })
                .andWhere('record.type = :type', { type: FundsRecordBase_1.FundsRecordType.Order })
                .andWhere('record.upOrDown = :upOrDown', { upOrDown: FundsRecordBase_1.FundsUpDown.Plus })
                .getRawOne();
            return refund || 0;
        });
    }
    static dayProfitOfUser(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                plusProfit: 0,
                minusProfit: 0,
            };
            let result = yield FundsRecordUser_1.query('record')
                .select(['record.upOrDown as upOrDown', 'SUM(record.funds) as profit'])
                .innerJoin('record.user', 'user', 'user.id = :id', { id: userId })
                .where(`to_days(record.createTime) = to_days(:date)`, { date: date })
                .andWhere('record.type = :type', { type: FundsRecordBase_1.FundsRecordType.Profit })
                .groupBy('record.upOrDown')
                .getRawMany();
            result.forEach((item) => {
                if (item.upOrDown === 'plus_consume') {
                    data.plusProfit = item.profit;
                }
                else {
                    data.minusProfit = item.profit;
                }
            });
            return utils_1.decimal(data.plusProfit).minus(data.minusProfit).toString();
        });
    }
    static clearFundsRecordUser(day) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("开始清除" + day + "天前的用户资金收支记录");
            let records = yield FundsRecordUser_1.query('record')
                .where('DATE_ADD(record.createTime, INTERVAL :day DAY) < NOW()', { day: day })
                .getMany();
            yield FundsRecordUser_1.p().remove(records);
            console.log("清除用户资金收支记录完成");
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
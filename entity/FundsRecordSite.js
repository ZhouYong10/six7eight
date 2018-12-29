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
var FundsRecordSite_1;
"use strict";
const typeorm_1 = require("typeorm");
const FundsRecordBase_1 = require("./FundsRecordBase");
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
const utils_1 = require("../utils");
let FundsRecordSite = FundsRecordSite_1 = class FundsRecordSite extends FundsRecordBase_1.FundsRecordBase {
    constructor() {
        super(...arguments);
        this.baseFunds = 0;
    }
    static p() {
        return typeorm_1.getRepository(FundsRecordSite_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordSite_1.p().save(this);
        });
    }
    static query(name) {
        return FundsRecordSite_1.p().createQueryBuilder(name);
    }
    static allOf(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordSite_1.query('record')
                .innerJoin('record.site', 'site', 'site.id = :id', { id: siteId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('record.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static allProfitOf(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordSite_1.query('record')
                .where('record.type = :type', { type: FundsRecordBase_1.FundsRecordType.Profit })
                .innerJoin('record.site', 'site', 'site.id = :id', { id: siteId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('record.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static dayBaseFundsAndProfit(date) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                plusBaseFunds: 0,
                plusProfit: 0,
                minusBaseFunds: 0,
                minusProfit: 0
            };
            let result = yield FundsRecordSite_1.query('record')
                .select(['record.upOrDown as upOrDown', 'SUM(record.baseFunds) as baseFunds',
                'SUM(record.funds) as profit'])
                .where(`to_days(record.createTime) = to_days(:date)`, { date: date })
                .groupBy('record.upOrDown')
                .getRawMany();
            result.forEach((item) => {
                if (item.upOrDown === 'plus_consume') {
                    data.plusBaseFunds = item.baseFunds;
                    data.plusProfit = item.profit;
                }
                else {
                    data.minusBaseFunds = item.baseFunds;
                    data.minusProfit = item.profit;
                }
            });
            let siteDayBaseFunds = utils_1.decimal(data.plusBaseFunds).minus(data.minusBaseFunds).toString();
            return {
                siteDayBaseFunds: siteDayBaseFunds,
                siteDayProfit: utils_1.decimal(data.plusProfit).minus(data.minusProfit).minus(siteDayBaseFunds).toString()
            };
        });
    }
    static dayBaseFundsAndProfitOfSite(siteId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {
                plusBaseFunds: 0,
                plusProfit: 0,
                minusBaseFunds: 0,
                minusProfit: 0
            };
            let result = yield FundsRecordSite_1.query('record')
                .select(['record.upOrDown as upOrDown', 'SUM(record.baseFunds) as baseFunds',
                'SUM(record.funds) as profit'])
                .innerJoin('record.site', 'site', 'site.id = :id', { id: siteId })
                .where(`to_days(record.createTime) = to_days(:date)`, { date: date })
                .groupBy('record.upOrDown')
                .getRawMany();
            result.forEach((item) => {
                if (item.upOrDown === 'plus_consume') {
                    data.plusBaseFunds = item.baseFunds;
                    data.plusProfit = item.profit;
                }
                else {
                    data.minusBaseFunds = item.baseFunds;
                    data.minusProfit = item.profit;
                }
            });
            let siteDayBaseFunds = utils_1.decimal(data.plusBaseFunds).minus(data.minusBaseFunds).toString();
            return {
                siteDayBaseFunds: siteDayBaseFunds,
                siteDayProfit: utils_1.decimal(data.plusProfit).minus(data.minusProfit).minus(siteDayBaseFunds).toString()
            };
        });
    }
};
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], FundsRecordSite.prototype, "baseFunds", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.fundsRecords),
    __metadata("design:type", Site_1.Site)
], FundsRecordSite.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.fundsRecords),
    __metadata("design:type", UserSite_1.UserSite)
], FundsRecordSite.prototype, "userSite", void 0);
FundsRecordSite = FundsRecordSite_1 = __decorate([
    typeorm_1.Entity()
], FundsRecordSite);
exports.FundsRecordSite = FundsRecordSite;
//# sourceMappingURL=FundsRecordSite.js.map
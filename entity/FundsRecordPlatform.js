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
var FundsRecordPlatform_1;
"use strict";
const FundsRecordBase_1 = require("./FundsRecordBase");
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
let FundsRecordPlatform = FundsRecordPlatform_1 = class FundsRecordPlatform extends FundsRecordBase_1.FundsRecordBase {
    constructor() {
        super(...arguments);
        this.baseFunds = 0;
    }
    static p() {
        return typeorm_1.getRepository(FundsRecordPlatform_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordPlatform_1.p().save(this);
        });
    }
    static query(name) {
        return FundsRecordPlatform_1.p().createQueryBuilder(name);
    }
    static all(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FundsRecordPlatform_1.query('record')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .addOrderBy('record.createTime', 'DESC')
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
            let result = yield FundsRecordPlatform_1.query('record')
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
            return {
                platDayBaseFunds: utils_1.decimal(data.plusBaseFunds).minus(data.minusBaseFunds).toString(),
                platDayProfit: utils_1.decimal(data.plusProfit).minus(data.minusProfit).toString()
            };
        });
    }
    static clearFundsRecordPlatform(day) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("开始清除" + day + "天前的平台资金收支记录");
            let records = yield FundsRecordPlatform_1.query('record')
                .where('DATE_ADD(record.createTime, INTERVAL :day DAY) < NOW()', { day: day })
                .getMany();
            yield FundsRecordPlatform_1.p().remove(records);
            console.log("清除平台资金收支记录完成");
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
], FundsRecordPlatform.prototype, "baseFunds", void 0);
FundsRecordPlatform = FundsRecordPlatform_1 = __decorate([
    typeorm_1.Entity()
], FundsRecordPlatform);
exports.FundsRecordPlatform = FundsRecordPlatform;
//# sourceMappingURL=FundsRecordPlatform.js.map
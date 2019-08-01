import {FundsRecordBase, FundsUpDown} from "./FundsRecordBase";
import {Column, Entity, getRepository, getConnection} from "typeorm";
import {decimal} from "../utils";
import {Platform} from "./Platform";

@Entity()
export class FundsRecordPlatform extends FundsRecordBase{
    // 消费成本
    @Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    })
    baseFunds: number = 0;

    private static p() {
        return getRepository(FundsRecordPlatform);
    }

    async save() {
        return await FundsRecordPlatform.p().save(this);
    }

    private static query(name: string) {
        return FundsRecordPlatform.p().createQueryBuilder(name);
    }

    static async all(page: any) {
        return await FundsRecordPlatform.query('record')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .addOrderBy('record.createTime', 'DESC')
            .getManyAndCount();
    }

    /* 根据日期统计平台成本和利润 */
    static async dayBaseFundsAndProfit(date: string) {
        let data = {
            plusBaseFunds: 0,
            plusProfit: 0,
            minusBaseFunds: 0,
            minusProfit: 0
        };
        let result = await FundsRecordPlatform.query('record')
            .select(['record.upOrDown as upOrDown', 'SUM(record.baseFunds) as baseFunds',
                'SUM(record.funds) as profit'])
            .where(`to_days(record.createTime) = to_days(:date)`, {date: date})
            .groupBy('record.upOrDown')
            .getRawMany();
        result.forEach((item: any) => {
            if(item.upOrDown === 'plus_consume'){
                data.plusBaseFunds = item.baseFunds;
                data.plusProfit = item.profit;
            }else{
                data.minusBaseFunds = item.baseFunds;
                data.minusProfit = item.profit;
            }
        });
        return {
            platDayBaseFunds: decimal(data.plusBaseFunds).minus(data.minusBaseFunds).toString(),
            platDayProfit: decimal(data.plusProfit).minus(data.minusProfit).toString()
        };
    }

    static async clearFundsRecordPlatform(day: number) {
        let records = await FundsRecordPlatform.query('record')
            .where('DATE_ADD(record.createTime, INTERVAL :day DAY) < NOW()', {day: day})
            .getMany();
        let baseFunds = decimal(0);
        let funds = decimal(0);
        for (let i = 0; i < records.length; i++) {
            let record = records[i];
            if (record.upOrDown === FundsUpDown.Plus) {
                baseFunds = decimal(baseFunds).plus(record.baseFunds);
                funds = decimal(funds).plus(record.funds);
            }else{
                baseFunds = decimal(baseFunds).minus(record.baseFunds);
                funds = decimal(funds).minus(record.funds);
            }
        }
        let platform = <Platform>await Platform.find();
        if (baseFunds.toNumber() > 0) {
            platform.baseFunds = parseFloat(decimal(platform.baseFunds).minus(baseFunds).toFixed(4));
        } else {
            platform.baseFunds = parseFloat(decimal(platform.baseFunds).plus(baseFunds).toFixed(4));
        }
        if (funds.toNumber() > 0) {
            platform.allProfit = parseFloat(decimal(platform.allProfit).minus(funds).toFixed(4));
        } else {
            platform.allProfit = parseFloat(decimal(platform.allProfit).plus(funds).toFixed(4));
        }
        await platform.save();
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(FundsRecordPlatform)
            .where('DATE_ADD(createTime, INTERVAL :day DAY) < NOW()', {day: day})
            .execute();
    }
}

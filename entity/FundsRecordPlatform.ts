import {FundsRecordBase} from "./FundsRecordBase";
import {Column, Entity, getRepository} from "typeorm";
import {decimal} from "../utils";

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
}

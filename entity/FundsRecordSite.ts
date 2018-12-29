import {Column, Entity, getRepository, ManyToOne} from "typeorm";
import {FundsRecordBase, FundsRecordType} from "./FundsRecordBase";
import {Site} from "./Site";
import {UserSite} from "./UserSite";
import {decimal} from "../utils";

@Entity()
export class FundsRecordSite extends FundsRecordBase{

    // 消费成本
    @Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    })
    baseFunds: number = 0;

    // 消费记录所属分站
    @ManyToOne(type => Site, site => site.fundsRecords)
    site!: Site;

    // 资金变动所属分站管理员
    @ManyToOne(type => UserSite, userSite => userSite.fundsRecords)
    userSite?: UserSite;



    private static p() {
        return getRepository(FundsRecordSite);
    }

    async save() {
        return await FundsRecordSite.p().save(this);
    }

    private static query(name: string) {
        return FundsRecordSite.p().createQueryBuilder(name);
    }

    static async allOf(siteId: string, page: any) {
        return await FundsRecordSite.query('record')
            .innerJoin('record.site', 'site', 'site.id = :id', {id: siteId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('record.createTime', 'DESC')
            .getManyAndCount();
    }

    static async allProfitOf(siteId: string, page:any) {
        return await FundsRecordSite.query('record')
            .where('record.type = :type', {type: FundsRecordType.Profit})
            .innerJoin('record.site', 'site', 'site.id = :id', {id: siteId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('record.createTime', 'DESC')
            .getManyAndCount();
    }

    /* 根据日期统计所有分站成本和利润 */
    static async dayBaseFundsAndProfit(date: string) {
        let data = {
            plusBaseFunds: 0,
            plusProfit: 0,
            minusBaseFunds: 0,
            minusProfit: 0
        };
        let result = await FundsRecordSite.query('record')
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
        let siteDayBaseFunds = decimal(data.plusBaseFunds).minus(data.minusBaseFunds).toString();
        return {
            siteDayBaseFunds: siteDayBaseFunds,
            siteDayProfit: decimal(data.plusProfit).minus(data.minusProfit).minus(siteDayBaseFunds).toString()
        };
    }

    /* 根据日期统计指定分站成本和利润 */
    static async dayBaseFundsAndProfitOfSite(siteId: string, date: string) {
        let data = {
            plusBaseFunds: 0,
            plusProfit: 0,
            minusBaseFunds: 0,
            minusProfit: 0
        };
        let result = await FundsRecordSite.query('record')
            .select(['record.upOrDown as upOrDown', 'SUM(record.baseFunds) as baseFunds',
                'SUM(record.funds) as profit'])
            .innerJoin('record.site', 'site', 'site.id = :id', {id: siteId})
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
        let siteDayBaseFunds = decimal(data.plusBaseFunds).minus(data.minusBaseFunds).toString();
        return {
            siteDayBaseFunds: siteDayBaseFunds,
            siteDayProfit: decimal(data.plusProfit).minus(data.minusProfit).minus(siteDayBaseFunds).toString()
        };
    }
}
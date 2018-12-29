import {FundsRecordBase, FundsRecordType, FundsUpDown} from "./FundsRecordBase";
import {Entity, getRepository, In, ManyToOne} from "typeorm";
import {User} from "./User";
import {decimal} from "../utils";

@Entity()
export class FundsRecordUser extends FundsRecordBase{
    // 所属账户
    @ManyToOne(type => User, user => user.fundsRecords)
    user!: User;

    private static p() {
        return getRepository(FundsRecordUser);
    }

    async save() {
        return await FundsRecordUser.p().save(this);
    }

    private static query(name: string) {
        return FundsRecordUser.p().createQueryBuilder(name);
    }

    static async findByUserId(userId: string, page:any) {
        return await FundsRecordUser.query('consume')
            .innerJoin('consume.user', 'user', 'user.id = :id', {id: userId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .addOrderBy('consume.createTime', 'DESC')
            .getManyAndCount();
    }

    static async allProfitByUserId(userId: string, page:any) {
        return await FundsRecordUser.query('consume')
            .where('consume.type = :type', {type: FundsRecordType.Profit})
            .innerJoin('consume.user', 'user', 'user.id = :id', {id: userId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .addOrderBy('consume.createTime', 'DESC')
            .getManyAndCount();
    }

    static async platUpRoleOfDay(date: string) {
        return await FundsRecordUser.query('record')
            .where(`to_days(record.createTime) = to_days(:date)`, {date: date})
            .andWhere('record.type = :type', {type: FundsRecordType.UpRole})
            .getCount();
    }

    static async siteUpRoleOfDay(siteId: string, date: string) {
        return await FundsRecordUser.query('record')
            .innerJoin('record.user', 'user')
            .innerJoin('user.site', 'site', 'site.id = :id', {id: siteId})
            .where(`to_days(record.createTime) = to_days(:date)`, {date: date})
            .andWhere('record.type = :type', {type: FundsRecordType.UpRole})
            .getCount();
    }

    static async dayConsumeOfUser(userId: string, date: string) {
        let {minusConsume} = await FundsRecordUser.query('record')
            .select(['SUM(record.funds) as minusConsume'])
            .innerJoin('record.user', 'user', 'user.id = :id', {id: userId})
            .where(`to_days(record.createTime) = to_days(:date)`, {date: date})
            .andWhere('record.type IN (:types)', {types: [FundsRecordType.Order, FundsRecordType.UpRole]})
            .andWhere('record.upOrDown = :upOrDown', {upOrDown: FundsUpDown.Minus})
            .getRawOne();
        let {plusConsume} = await FundsRecordUser.query('record')
            .select(['SUM(record.funds) as plusConsume'])
            .innerJoin('record.user', 'user', 'user.id = :id', {id: userId})
            .where(`to_days(record.createTime) = to_days(:date)`, {date: date})
            .andWhere('record.type = :type', {type: FundsRecordType.Order})
            .andWhere('record.upOrDown = :upOrDown', {upOrDown: FundsUpDown.Plus})
            .getRawOne();
        console.log(minusConsume, ' 1111111111111111111111111111');
        console.log(plusConsume, ' 22222222222222222222222222222')
        return decimal(minusConsume || 0).minus(plusConsume || 0).toString();
    }

    static async dayProfitOfUser(userId: string, date: string) {
        let data = {
            plusProfit: 0,
            minusProfit: 0,
        };
        let result = await FundsRecordUser.query('record')
            .select(['record.upOrDown as upOrDown', 'SUM(record.funds) as profit'])
            .innerJoin('record.user', 'user', 'user.id = :id', {id: userId})
            .where(`to_days(record.createTime) = to_days(:date)`, {date: date})
            .andWhere('record.type = :type', {type: FundsRecordType.Profit})
            .groupBy('record.upOrDown')
            .getRawMany();
        result.forEach((item: any) => {
            if(item.upOrDown === 'plus_consume'){
                data.plusProfit = item.profit;
            }else{
                data.minusProfit = item.profit;
            }
        });
        return decimal(data.plusProfit).minus(data.minusProfit).toString();
    }
}

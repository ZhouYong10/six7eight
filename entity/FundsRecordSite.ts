import {Column, Entity, getRepository, ManyToOne} from "typeorm";
import {FundsRecordBase, FundsRecordType} from "./FundsRecordBase";
import {Site} from "./Site";
import {UserSite} from "./UserSite";
import {FundsRecordUser} from "./FundsRecordUser";

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
        return FundsRecordSite.query('record')
            .innerJoin('record.site', 'site', 'site.id = :id', {id: siteId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('record.createTime', 'DESC')
            .getManyAndCount();
    }

    static async allProfitOf(siteId: string, page:any) {
        return FundsRecordSite.query('record')
            .where('record.type = :type', {type: FundsRecordType.Profit})
            .innerJoin('record.site', 'site', 'site.id = :id', {id: siteId})
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('record.createTime', 'DESC')
            .getManyAndCount();
    }
}
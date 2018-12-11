import {FundsRecordBase} from "./FundsRecordBase";
import {Column, Entity, getRepository} from "typeorm";

@Entity()
export class FundsRecordPlatform extends FundsRecordBase{
    // 消费成本
    @Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    })
    baseFunds!: number;

    private static p() {
        return getRepository(FundsRecordPlatform);
    }

    async save() {
        return await FundsRecordPlatform.p().save(this);
    }

    private static query(name: string) {
        return FundsRecordPlatform.p().createQueryBuilder(name);
    }

    static async all() {
        return await FundsRecordPlatform.query('record')
            .addOrderBy('record.createTime', 'DESC')
            .getMany();
    }
}
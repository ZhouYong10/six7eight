import {FundsRecordBase} from "./FundsRecordBase";
import {Entity, getRepository, ManyToOne} from "typeorm";
import {User} from "./User";

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

    static async findByUserId(userId: string) {
        return FundsRecordUser.query('consume')
            .innerJoin('consume.user', 'user', 'user.id = :id', {id: userId})
            .addOrderBy('consume.createTime', 'DESC')
            .getMany();
    }
}

import {ConsumeBase} from "./ConsumeBase";
import {Entity, getRepository, ManyToOne, OneToOne} from "typeorm";
import {User} from "./User";
import {OrderUser} from "./OrderUser";

@Entity()
export class ConsumeUser extends ConsumeBase{
    // 所属账户
    @ManyToOne(type => User, user => user.consumes)
    user!: User;

    private static p() {
        return getRepository(ConsumeUser);
    }

    async save() {
        return await ConsumeUser.p().save(this);
    }

    private static query(name: string) {
        return ConsumeUser.p().createQueryBuilder(name);
    }

    static async findByUserId(userId: string) {
        return ConsumeUser.query('consume')
            .innerJoin('consume.user', 'user', 'user.id = :id', {id: userId})
            .addOrderBy('consume.createTime', 'DESC')
            .getMany();
    }
}

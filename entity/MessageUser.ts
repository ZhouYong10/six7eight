import {Entity, getRepository, ManyToOne, getConnection} from "typeorm";
import {MessageBase} from "./MessageBase";
import {User} from "./User";

@Entity()
export class MessageUser extends MessageBase{


    // 消息所属账户
    @ManyToOne(type => User, user => user.messages)
    user!: User;


    private static p() {
        return getRepository(MessageUser);
    }

    async save() {
        return await MessageUser.p().save(this);
    }

    private static query(name: string) {
        return MessageUser.p().createQueryBuilder(name);
    }

    static async getWaitCount(userId: string) {
        return await MessageUser.query('msg')
            .innerJoin('msg.user', 'user', 'user.id = :id', {id: userId})
            .getCount()
    }

    static async loadMessages(userId: string) {
        return await MessageUser.query('msg')
            .innerJoin('msg.user', 'user', 'user.id = :id', {id: userId})
            .orderBy('msg.createTime', 'ASC')
            .getManyAndCount();
    }

    static async delete(id: string) {
        return await MessageUser.p().delete(id);
    }

    static async clearMessageUser(day: number) {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(MessageUser)
            .where('DATE_ADD(createTime, INTERVAL :day DAY) < NOW()', {day: day})
            .execute();
    }
}
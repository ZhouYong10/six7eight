import {Entity, getRepository, ManyToOne} from "typeorm";
import {MessageBase} from "./MessageBase";
import {UserSite} from "./UserSite";

@Entity()
export class MessageUserSite extends MessageBase{


    // 消息所属账户
    @ManyToOne(type => UserSite, userSite => userSite.messages)
    user!: UserSite;


    private static p() {
        return getRepository(MessageUserSite);
    }

    async save() {
        return await MessageUserSite.p().save(this);
    }

    private static query(name: string) {
        return MessageUserSite.p().createQueryBuilder(name);
    }

    static async getWaitCount(userId: string) {
        return await MessageUserSite.query('msg')
            .innerJoin('msg.user', 'user', 'user.id = :id', {id: userId})
            .getCount()
    }

    static async loadMessageNum(userId: string) {
        return await MessageUserSite.query('msg')
            .innerJoin('msg.user', 'user', 'user.id = :id', {id: userId})
            .orderBy('msg.createTime', 'ASC')
            .getCount();
    }

    static async loadMessages(userId: string) {
        return await MessageUserSite.query('msg')
            .innerJoin('msg.user', 'user', 'user.id = :id', {id: userId})
            .orderBy('msg.createTime', 'ASC')
            .getManyAndCount();
    }

    static async delete(id: string) {
        return await MessageUserSite.p().delete(id);
    }
}
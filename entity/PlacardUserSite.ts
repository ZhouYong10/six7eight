import {Entity, getRepository, ManyToOne} from "typeorm";
import {PlacardBase} from "./PlacardBase";
import {UserAdmin} from "./UserAdmin";

@Entity()
export class PlacardUserSite extends PlacardBase{
    // 发布公告的账户
    @ManyToOne(type => UserAdmin, userAdmin => userAdmin.placards)
    user!: UserAdmin;


    private static p() {
        return getRepository(PlacardUserSite);
    }

    async save() {
        return await PlacardUserSite.p().save(this);
    }

    private static query(name: string) {
        return PlacardUserSite.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await PlacardUserSite.query('placard')
            .orderBy('placard.createTime', 'DESC')
            .getMany();
    }

    static async update(id: string, placard:PlacardUserSite) {
        return await PlacardUserSite.p().update(id, placard);
    }

    static async delById(id: string) {
        return await PlacardUserSite.p().delete(id);
    }

    static async findById(id: string){
        return await PlacardUserSite.p().findOne(id);
    };
}
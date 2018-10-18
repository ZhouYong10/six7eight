import {Entity, getRepository, JoinTable, ManyToMany, ManyToOne} from "typeorm";
import {PlacardBase} from "./PlacardBase";
import {UserAdmin} from "./UserAdmin";
import {Site} from "./Site";

@Entity()
export class PlacardUserSite extends PlacardBase{
    // 发布公告的账户
    @ManyToOne(type => UserAdmin, userAdmin => userAdmin.placards)
    user!: UserAdmin;

    // 发布到的站点
    @ManyToMany(type => Site)
    @JoinTable()
    sites!: Site[];


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
            .leftJoinAndSelect('placard.sites', 'site')
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
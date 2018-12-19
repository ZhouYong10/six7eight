import {Entity, getRepository, ManyToOne} from "typeorm";
import {PlacardBase} from "./PlacardBase";
import {Site} from "./Site";
import {UserSite} from "./UserSite";

@Entity()
export class PlacardUser extends PlacardBase{
    // 公告所属分站
    @ManyToOne(type => Site, site => site.placards)
    site!: Site;

    // 发布公告的账户
    @ManyToOne(type => UserSite, userSite => userSite.placards)
    user!: UserSite;


    private static p() {
        return getRepository(PlacardUser);
    }

    async save() {
        return await PlacardUser.p().save(this);
    }

    private static query(name: string) {
        return PlacardUser.p().createQueryBuilder(name);
    }

    static async getAll(page:any) {
        return await PlacardUser.query('placard')
            .leftJoinAndSelect('placard.site', 'site')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('placard.createTime', 'DESC')
            .getManyAndCount();
    }

    static async getSiteAll(siteId: string, page:any) {
        return await PlacardUser.query('placard')
            .innerJoin('placard.site', 'site', 'site.id = :siteId', {siteId: siteId})
            .leftJoinAndSelect('placard.user', 'user')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .orderBy('placard.createTime', 'DESC')
            .getManyAndCount();
    }

    static async getUserPlacards(siteAddress: string) {
        return await PlacardUser.query('placard')
            .innerJoin('placard.site', 'site', 'site.address = address', {address: siteAddress})
            .orderBy('placard.createTime', 'DESC')
            .limit(3)
            .getMany();
    }

    static async update(id: string, placard:PlacardUser) {
        return await PlacardUser.p().update(id, placard);
    }

    static async delById(id: string) {
        return await PlacardUser.p().delete(id);
    }

    static async findById(id: string){
        return await PlacardUser.p().findOne(id);
    };

}
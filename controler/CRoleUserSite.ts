import {RoleUserSite} from "../entity/RoleUserSite";
import {Site} from "../entity/Site";

export class CRoleUserSite {

    static async save(info: any) {
        let role = new RoleUserSite();
        role.name = info.name;
        role.rights = info.rights;
        role.site = info.site;
        return await role.save();
    }

    static async allRoles(siteId:string) {
        return await RoleUserSite.getAll(siteId);
    }

    static async typeUserRoles(siteId: string) {
        return await RoleUserSite.typeUserAll(siteId);
    }

    static async findByName(name: string) {
        return await RoleUserSite.findByName(name);
    }

    static async saveOne(info:any, site: Site){
        let role = new RoleUserSite();
        role.name = info.name;
        role.rights = info.rights;
        role.site = site;
        return await role.save()
    }

    static async update(info: any) {
        return await RoleUserSite.update(info.id, {
            name: info.name,
            rights: info.rights
        });
    }

    static async delById(id: string) {
        let role = <RoleUserSite>await RoleUserSite.findByIdWithRelations(id);
        if (role.users && role.users.length > 0) {
            throw(new Error('该角色上有关联的账户，不能删除！'));
        }else{
            await RoleUserSite.delById(id);
        }
    }

}
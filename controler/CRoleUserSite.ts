import {RoleUserSite} from "../entity/RoleUserSite";

export class CRoleUserSite {

    static async save(info: any) {
        let role = new RoleUserSite();
        role.name = info.name;
        role.rights = info.rights;
        role.site = info.site;
        return await role.save();
    }

}
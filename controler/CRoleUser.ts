import {RoleUser} from "../entity/RoleUser";

export class CRoleUser {

    static async findById(id: string) {
        return await RoleUser.findById(id);
    }

    static async save(info: any) {
        let role = new RoleUser();
        role.name = info.name;
        role.type = info.type;
        role.rights = info.rights;
        role.site = info.site;
        return await role.save();
    }

    static async allRoles() {
        return await RoleUser.getAll();
    }

    static async update(info: any) {
        let role = new RoleUser();
        role.name = info.name;
        role.rights = info.rights;
        return await RoleUser.update(info.id, role);
    }

}
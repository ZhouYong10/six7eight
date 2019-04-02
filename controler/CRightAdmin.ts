import {RightAdmin} from "../entity/RightAdmin";
import {RightType} from "../entity/RightBase";
import {EntityManager, getManager} from "typeorm";
import {RoleUserAdmin, RoleUserAdminType} from "../entity/RoleUserAdmin";

export class CRightAdmin {

    static async show() {
        return await RightAdmin.findTrees();
    }

    static async add(info: any) {
        let {type, name, icon, path, fingerprint, parentId} = info;
        return await getManager().transaction(async tem => {
            let right = new RightAdmin();
            right.setType = type;
            right.name = name;
            right.icon = icon;
            right.path = path;
            right.fingerprint = fingerprint;
            if (parentId) {
                right.parent = <RightAdmin>await tem.findOne(RightAdmin, parentId);
                right.pId = right.parent.id;
            }else{
                right.pId = '0';
            }
            if (right.getType === RightType.MenuGroup || right.getType === RightType.Menu) {
                right.children = [];
            }
            await CRightAdmin.updateRoleUserAdminFingerprint(tem, fingerprint);
            return await tem.save(right);
        });
    }

    private static async updateRoleUserAdminFingerprint(tem: EntityManager, fingerprint: string) {
        let roleAdmins = await tem.createQueryBuilder()
            .select('role')
            .from(RoleUserAdmin, 'role')
            .where('role.type = :type', {type: RoleUserAdminType.Developer})
            .getMany();
        for (let i = 0; i < roleAdmins.length; i++) {
            let roleAdmin = roleAdmins[i];
            roleAdmin.rights.push(fingerprint);
            roleAdmin.editRights.push(fingerprint);
            await tem.save(roleAdmin);
        }
    }

    static async update(info: any) {
        let {id, name, icon, fingerprint, path} = info;
        await getManager().transaction(async tem => {
            let rightAdmin = <RightAdmin>await tem.findOne(RightAdmin, id);
            rightAdmin.name = name;
            rightAdmin.icon = icon;
            rightAdmin.fingerprint = fingerprint;
            rightAdmin.path = path;
            await CRightAdmin.updateRoleUserAdminFingerprint(tem, fingerprint);
            await tem.save(rightAdmin);
        });
    }

    static async changeRightSort(info: any) {
        let {rightDrag, rightDrop} = info;
        await getManager().transaction(async tem => {
            await tem.update(RightAdmin, rightDrag.id, {num: rightDrag.num, pId: rightDrag.parentId});
            await tem.createQueryBuilder()
                .relation(RightAdmin, 'parent')
                .of(rightDrag.id)
                .set(rightDrag.parentId === '0' ? null: rightDrag.parentId);


            await tem.update(RightAdmin, rightDrop.id, {num: rightDrop.num});
        });
    }
}
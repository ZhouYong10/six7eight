import {RightType} from "../entity/RightBase";
import {RightSite} from "../entity/RightSite";
import {EntityManager, getManager} from "typeorm";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {RoleUserAdmin} from "../entity/RoleUserAdmin";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";

export class CRightSite {

    static async show() {
        return await RightSite.findTrees();
    }

    static async add(info: any) {
        let {type, name, icon, path, fingerprint, parentId} = info;
        return await getManager().transaction(async tem => {
            let right = new RightSite();
            right.setType = type;
            right.name = name;
            right.icon = icon;
            right.path = path;
            right.fingerprint = fingerprint;
            if (parentId) {
                right.parent = <RightSite>await tem.findOne(RightSite, parentId);
                right.pId = right.parent.id;
            }else{
                right.pId = '0';
            }
            if (right.getType === RightType.MenuGroup || right.getType === RightType.Menu) {
                right.children = [];
            }
            await CRightSite.updateRoleUserSiteFingerprint(tem, fingerprint);
            return await tem.save(right);
        });
    }

    private static async updateRoleUserSiteFingerprint(tem: EntityManager, fingerprint: string) {
        let roleSites = await tem.createQueryBuilder()
            .select('role')
            .from(RoleUserSite, 'role')
            .where('role.type = :type', {type: RoleUserSiteType.Site})
            .getMany();
        for (let i = 0; i < roleSites.length; i++) {
            let roleSite = roleSites[i];
            roleSite.rights.push(fingerprint);
            roleSite.editRights.push(fingerprint);
            await tem.save(roleSite);
        }
    }

    static async update(info: any) {
        let {id, name, icon, fingerprint, path} = info;
        await getManager().transaction(async tem => {
            let rightSite = <RightSite>await tem.findOne(RightSite, id);
            rightSite.name = name;
            rightSite.icon = icon;
            rightSite.fingerprint = fingerprint;
            rightSite.path = path;
            await CRightSite.updateRoleUserSiteFingerprint(tem, fingerprint);
            await tem.save(rightSite);
        });
    }

    static async changeRightSort(info: any) {
        let {rightDrag, rightDrop} = info;
        await getManager().transaction(async tem => {
            await tem.update(RightSite, rightDrag.id, {num: rightDrag.num, pId: rightDrag.parentId});
            await tem.createQueryBuilder()
                .relation(RightSite, 'parent')
                .of(rightDrag.id)
                .set(rightDrag.parentId === '0' ? null: rightDrag.parentId);


            await tem.update(RightSite, rightDrop.id, {num: rightDrop.num});
        });
    }
}
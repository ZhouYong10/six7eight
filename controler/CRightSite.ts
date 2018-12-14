import {RightType} from "../entity/RightBase";
import {RightSite} from "../entity/RightSite";
import {getManager} from "typeorm";

export class CRightSite {

    static async show() {
        return await RightSite.findTrees();
    }

    static async add(info: any) {
        let {type, name, icon, path, fingerprint, parentId} = info;
        let right = new RightSite();
        right.setType = type;
        right.name = name;
        right.icon = icon;
        right.path = path;
        right.fingerprint = fingerprint;

        if (parentId) {
            right.parent = <RightSite>await RightSite.findById(parentId);
            right.pId = right.parent.id;
        }else{
            right.pId = '0';
        }
        if (right.getType === RightType.MenuGroup || right.getType === RightType.Menu) {
            right.children = [];
        }
        return await right.save();
    }

    static async update(info: any) {
        let {id, name, icon, fingerprint, path} = info;
        await RightSite.update(id, {
            name: name,
            icon: icon,
            fingerprint: fingerprint,
            path: path
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
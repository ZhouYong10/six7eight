import {RightAdmin} from "../entity/RightAdmin";
import {RightType} from "../entity/RightBase";
import {getManager} from "typeorm";

export class CRightAdmin {

    static async show() {
        return await RightAdmin.findTrees();
    }

    static async add(info: any) {
        let {type, name, icon, path, fingerprint, parentId} = info;
        let right = new RightAdmin();
        right.setType = type;
        right.name = name;
        right.icon = icon;
        right.path = path;
        right.fingerprint = fingerprint;

        if (parentId) {
            right.parent = <RightAdmin>await RightAdmin.findById(parentId);
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
        await RightAdmin.update(id, {
            name: name,
            icon: icon,
            fingerprint: fingerprint,
            path: path
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
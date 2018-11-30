import {getRightType, RightType} from "../entity/RightBase";
import {RightSite} from "../entity/RightSite";
import {RightAdmin} from "../entity/RightAdmin";

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
            right.parent = await RightSite.findById(parentId);
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
}
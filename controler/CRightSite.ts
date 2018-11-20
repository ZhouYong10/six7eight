import {getRightType, RightType} from "../entity/RightBase";
import {RightSite} from "../entity/RightSite";

export class CRightSite {

    static async show() {
        return await RightSite.findTrees();
    }

    static async save(info: any) {
        let right = new RightSite();
        right.type = <RightType>getRightType(info.type);
        right.icon = info.icon;
        right.name = info.name;
        right.componentName = info.componentName;

        let parent = await RightSite.findById(info.parent);
        if (parent) {
            right.parent = parent;
        }

        let rightSaved = await right.save();
        rightSaved.children = [];
        return rightSaved;
    }

    static async update(info: any) {
        await RightSite.update(info.id, {
            name: info.name,
            type: <RightType>getRightType(info.type),
            icon: info.icon,
            componentName: info.componentName
        });
    }
}
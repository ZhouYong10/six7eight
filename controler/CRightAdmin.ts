import {RightAdmin} from "../entity/RightAdmin";
import {getRightType, RightType} from "../entity/RightBase";

export class CRightAdmin {

    static async show() {
        return await RightAdmin.findTrees();
    }

    static async save(info: any) {
        let right = new RightAdmin();
        right.type = <RightType>getRightType(info.type);
        right.name = info.name;
        right.path = info.path;
        right.componentName = info.componentName;

        let parent = await RightAdmin.findById(info.parent);
        if (parent) {
            right.parent = parent;
        }

        return await right.save();
    }

    static async update(info: any) {
        let right = <RightAdmin>await RightAdmin.findById(info.id);
        right.type = <RightType>getRightType(info.type);
        right.name = info.name;
        right.path = info.path;
        right.componentName = info.componentName;
        return await right.save();
    }

    static async getChild(id: string) {
        return await RightAdmin.find({parent: id});
    }

    static async del(id: string) {
        await RightAdmin.delById(id);
    }
}
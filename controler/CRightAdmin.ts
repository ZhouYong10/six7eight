import {RightAdmin} from "../entity/RightAdmin";

export class CRightAdmin {

    static async show() {
        return await RightAdmin.find({parent: null});
    }

    static async getChild(id: string) {
        return await RightAdmin.find({parent: id});
    }

    static async save(info: any) {
        let right = new RightAdmin();
        right.name = info.name;
        right.path = info.path;
        right.componentName = info.componentName;
        right.hasChild = info.hasChild;
        if (right.hasChild) {
            right.children = [];
        }

        let parent = await RightAdmin.findById(info.parent);
        if (parent) {
            right.parent = parent;
        }

        return await right.save();
    }

    static async del(id: string) {
        await RightAdmin.delById(id);
    }
}
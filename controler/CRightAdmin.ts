import {RightAdmin} from "../entity/RightAdmin";
import {RightType} from "../entity/RightBase";

export class CRightAdmin {

    static async show() {
        // return await RightAdmin.find({parent: null});
        return await RightAdmin.findTrees();
    }

    static async getChild(id: string) {
        return await RightAdmin.find({parent: id});
    }

    static async save(info: any) {
        let right = new RightAdmin();
        switch (info.type) {
            case 'Page':
                right.type = RightType.Page;
                break;
            case 'MenuGroup':
                right.type = RightType.MenuGroup;
                break;
            case 'PageItem':
                right.type = RightType.PageItem;
                break;
        }
        right.name = info.name;
        right.path = info.path;
        right.componentName = info.componentName;

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
import {Entity, getManager, getRepository, Tree, TreeChildren, TreeParent} from "typeorm";
import {RightBase} from "./RightBase";

@Entity()
@Tree('closure-table')
export class RightAdmin extends RightBase {
    // 父权限
    @TreeParent()
    parent?: RightAdmin;

    // 子权限
    @TreeChildren()
    children?: RightAdmin[];



    private static p(){
        return getRepository(RightAdmin);
    }

    async save() {
        return await RightAdmin.p().save(this);
    }

    static async find(op: any) {
        return await RightAdmin.p().find(op);
    }

    static async findByName(username: string){
        return await RightAdmin.p().findOne({name: username});
    };

    static async findById(id: string){
        return await RightAdmin.p().findOne(id);
    };

    static async delById(id: string) {
        return await RightAdmin.p().delete(id);
    }


    private static treeP() {
        return getManager().getTreeRepository(RightAdmin);
    }

    static async findTrees() {
        return await RightAdmin.treeP().findTrees();
    }
}
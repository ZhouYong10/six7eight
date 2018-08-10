import {Entity, getManager, getRepository, Tree, TreeChildren, TreeParent} from "typeorm";
import {RightBase} from "./RightBase";

@Entity()
@Tree('materialized-path')
export class RightAdmin extends RightBase {
    // 父权限
    @TreeParent()
    parent!: RightAdmin;

    // 子权限
    @TreeChildren({
        cascade: true
    })
    children?: RightAdmin[];



    private static p(){
        return getRepository(RightAdmin);
    }


    async save() {
        return await RightAdmin.p().save(this);
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

    static async update(id: string, right: RightAdmin) {
        return await RightAdmin.p().update(id, right);
    }



    private static treeP() {
        return getManager().getTreeRepository(RightAdmin);
    }

    static async findTrees() {
        return await RightAdmin.treeP().findTrees();
    }


    async findDescendantsTree() {
        return await RightAdmin.treeP().findDescendantsTree(this);
    }

    async findAncestors() {
        return await RightAdmin.treeP().findAncestors(this);
    }

    async findAncestorsTree() {
        return await RightAdmin.treeP().findAncestorsTree(this);
    }
}
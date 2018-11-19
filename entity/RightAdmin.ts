import {Entity, getManager, getRepository, Tree, TreeChildren, TreeParent} from "typeorm";
import {RightBase, RightType} from "./RightBase";
import {sortRights} from "../utils";

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

    static async update(id: string, right: {
        name: string,
        type: RightType,
        icon: string,
        componentName: string
    }) {
        return await RightAdmin.p().update(id, right);
    }



    private static treeP() {
        return getManager().getTreeRepository(RightAdmin);
    }

    static async findTrees() {
        let rights = await RightAdmin.treeP().findTrees();
        if (rights[0]) {
            sortRights(rights[0].children);
        }
        return rights;
    }

    static async getAllLeaf() {
        let tree = await RightAdmin.treeP().findTrees();
        let leaves:string[] = [];

        function filterLeaf(tree: Array<RightAdmin>) {
            tree.forEach((right) => {
                if (!right.children || right.children.length < 1) {
                    leaves.push(right.id);
                } else {
                    filterLeaf(right.children);
                }
            });
        }

        filterLeaf(tree);
        return leaves;
    }



    async findDescendantsTree() {
        return await RightAdmin.treeP().findDescendantsTree(this);
    }

    async findDescendants() {
        return await RightAdmin.treeP().findDescendants(this);
    }

    async findAncestors() {
        return await RightAdmin.treeP().findAncestors(this);
    }

    async findAncestorsTree() {
        return await RightAdmin.treeP().findAncestorsTree(this);
    }
}
import {Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";
import {sortRights} from "../utils";

@Entity()
export class RightSite extends RightBase{
    // 父权限
    @ManyToOne(type => RightSite, rightSite => rightSite.children, {
        cascade: true
    })
    parent?: RightSite;

    // 子权限
    @OneToMany(type => RightSite, rightSite => rightSite.parent)
    children?: RightSite[];



    private static p(){
        return getRepository(RightSite);
    }


    async save() {
        return await RightSite.p().save(this);
    }

    static async findByName(username: string){
        return await RightSite.p().findOne({name: username});
    };

    static async findById(id: string){
        return await RightSite.p().findOne(id);
    };

    static async update(id: string, right: any) {
        return await RightSite.p().update(id, right);
    }


    private static async tree() {
        return await RightSite.p().createQueryBuilder('right')
            .where('right.pId = :pId', {pId: '0'})
            .leftJoinAndSelect('right.children', 'menu')
            .leftJoinAndSelect('menu.children', 'menuItem')
            .getMany();
    }

    static async findTrees() {
        let rightTree = await RightSite.tree();
        sortRights(rightTree);
        return rightTree;
    }

    static async getAllLeaf() {
        let tree = await RightSite.tree();
        let permissions:string[] = [];

        function filterLeaf(tree: Array<RightSite>) {
            tree.forEach((right) => {
                if (!right.children || right.children.length < 1) {
                    permissions.push(right.fingerprint);
                } else {
                    filterLeaf(right.children);
                }
            });
        }

        filterLeaf(tree);
        return permissions;
    }
}
import {Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";
import {sortRights} from "../utils";

@Entity()
export class RightAdmin extends RightBase {
    // 父权限
    @ManyToOne(type => RightAdmin, rightAdmin => rightAdmin.children, {
        cascade: true
    })
    parent?: RightAdmin;

    // 子权限
    @OneToMany(type => RightAdmin, rightAdmin => rightAdmin.parent)
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

    static async update(id: string, right: any) {
        return await RightAdmin.p().update(id, right);
    }

    private static async tree() {
        return await RightAdmin.p().createQueryBuilder('right')
            .where('right.pId = :pId', {pId: '0'})
            .leftJoinAndSelect('right.children', 'menu')
            .leftJoinAndSelect('menu.children', 'menuItem')
            .getMany();
    }

    static async findTrees() {
        let rightTree = await RightAdmin.tree();
        sortRights(rightTree);
        return rightTree;
    }

    static async getAllPermissions() {
        let tree = await RightAdmin.tree();
        let permissions:string[] = [];

        function getPermission(tree: Array<RightAdmin>) {
            tree.forEach((right) => {
                permissions.push(right.fingerprint);
                if (right.children && right.children.length > 0) {
                    getPermission(right.children);
                }
            });
        }

        getPermission(tree);
        return permissions;
    }

}
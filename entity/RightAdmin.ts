import {Entity, getRepository, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";

@Entity()
export class RightAdmin extends RightBase {
    // 父权限
    @ManyToOne(type => RightAdmin, rightAdmin => rightAdmin.children)
    parent?: RightAdmin;

    // 子权限
    @OneToMany(type => RightAdmin, rightAdmin => rightAdmin.parent, {
        onDelete: "CASCADE"
    })
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
}
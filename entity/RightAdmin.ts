import {Entity, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";

@Entity()
export class RightAdmin extends RightBase {
    // 父权限
    @ManyToOne(type => RightAdmin, rightAdmin => rightAdmin.children)
    parent?: RightAdmin;

    // 子权限
    @OneToMany(type => RightAdmin, rightAdmin => rightAdmin.parent)
    children?: RightAdmin[];

}
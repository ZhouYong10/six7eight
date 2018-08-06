import {Entity, ManyToOne, OneToMany} from "typeorm";
import {RightBase} from "./RightBase";

@Entity()
export class RightSite extends RightBase{
    // 父权限
    @ManyToOne(type => RightSite, rightSite => rightSite.children)
    parent?: RightSite;

    // 子权限
    @OneToMany(type => RightSite, rightSite => rightSite.parent)
    children?: RightSite[];

}
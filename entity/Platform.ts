import {Column, Entity, getRepository, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PlacardBase} from "./PlacardBase";
import {Site} from "./Site";
import {UserSite} from "./UserSite";

@Entity()
export class Platform{
    //ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 平台名称
    @Column()
    name: string = '678网络营销平台';

    // 是否开放注册
    @Column()
    canRegister: boolean = true;

    // 是否开放注册
    @Column()
    canAddUser: boolean = true;

    // 金牌代理升级价格
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    goldUpPrice!: number;

    // 超级代理升级价格
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    superUpPrice!: number;

    // 用户升级上级分成比例
    @Column({
        type: "decimal",
        precision: 3,
        scale: 2
    })
    upperRatio!: number;

    // 用户升级站点分成比例
    @Column({
        type: "decimal",
        precision: 3,
        scale: 2
    })
    siteRatio!: number;

    // 分站续费价格（年费）
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    siteYearPrice!: number;





    private static p() {
        return getRepository(Platform);
    }

    async save() {
        return await Platform.p().save(this);
    }

    private static query(name: string) {
        return Platform.p().createQueryBuilder(name);
    }


    static async update(id: string, platform:any) {
        await Platform.p().update(id, platform);
    }

    static async find() {
        return await Platform.p().findOne();
    }

}
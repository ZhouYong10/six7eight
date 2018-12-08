import {Column, Entity, getRepository, PrimaryGeneratedColumn} from "typeorm";
import {RoleType} from "./RoleUser";
import {assert} from "../utils";

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

    // 分站续费价格（年费）
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    siteYearPrice!: number;

    // 平台消费总成本
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    baseFunds!: number;

    // 平台消费所获总利润
    @Column({
        type: "decimal",
        precision: 13,
        scale: 4
    })
    allProfit!: number;

    // 用户提现最少金额
    @Column({
        type: "decimal",
        precision: 6,
        scale: 2
    })
    userWithdrawMin!: number;

    // 分站提现最少金额
    @Column({
        type: "decimal",
        precision: 6,
        scale: 2
    })
    siteWithdrawMin!: number;


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
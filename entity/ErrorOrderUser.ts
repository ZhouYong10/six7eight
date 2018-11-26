import {
    Entity,
    Column,
    ManyToOne,
    getRepository,
    PrimaryGeneratedColumn, CreateDateColumn
} from "typeorm";
import {myDateFromat} from "../utils";
import {UserSite} from "./UserSite";
import {UserAdmin} from "./UserAdmin";
import {OrderUser} from "./OrderUser";
import {WitchType} from "./ProductTypeBase";

@Entity()
export class ErrorOrderUser{
    // 备注ID
    @PrimaryGeneratedColumn("uuid")
    readonly id!: string;

    // 创建时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly createTime!:string;

    // 类型（区分平台产品订单报错还是分站自己的产品订单报错）
    @Column({
        type: "enum",
        enum: WitchType
    })
    type!: WitchType;

    // 订单报错内容
    @Column({
        type: "varchar",
        length: 160,
    })
    content!: string;

    // 订单报错处理状态
    @Column()
    isDeal: boolean = false;

    // 订单报错处理内容
    @Column({
        type: "varchar",
        length: 160,
        nullable: true
    })
    dealContent?: string;

    // 订单报错处理时间
    @Column({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        nullable: true
    })
    dealTime?: string;

    // 订单报错所属订单
    @ManyToOne(type => OrderUser, orderUser => orderUser.errors)
    order!: OrderUser;

    // 处理订单报错的分站管理员账户
    @ManyToOne(type => UserSite, userSite => userSite.errorsOrderUser)
    userSite?: UserSite;

    // 处理订单报错的平台管理员账户
    @ManyToOne(type => UserAdmin, userAdmin => userAdmin.errorsOrderUser)
    userAdmin?: UserAdmin;



    private static p() {
        return getRepository(ErrorOrderUser);
    }

    private static query(name: string) {
        return ErrorOrderUser.p().createQueryBuilder(name);
    }

    async save() {
        return await ErrorOrderUser.p().save(this);
    }

}



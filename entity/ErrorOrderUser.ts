import {
    Entity,
    Column,
    ManyToOne,
    getRepository,
    PrimaryGeneratedColumn, CreateDateColumn, In, getConnection
} from "typeorm";
import {myDateFromat} from "../utils";
import {UserSite} from "./UserSite";
import {UserAdmin} from "./UserAdmin";
import {OrderUser} from "./OrderUser";
import {WitchType} from "./ProductTypeBase";
import {Site} from "./Site";

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

    // 商品id, 区分该报错属于哪类商品
    @Column()
    productId!: string;

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
    @ManyToOne(type => OrderUser, orderUser => orderUser.errors, {
        onDelete: "SET NULL"
    })
    order!: OrderUser;

    @Column({nullable: true})
    orderId?: string;

    // 报错所属分站
    @ManyToOne(type => Site, site => site.errorsOrderUser)
    site!: Site;

    @Column({nullable: true})
    siteId?: string;

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

    static async platformAll(productIds: Array<string>, page:any) {
        if (productIds.length < 1) {
            productIds = [''];
        }
        return ErrorOrderUser.query('error')
            .where({productId: In(productIds)})
            .leftJoinAndSelect('error.order', 'order')
            .leftJoinAndSelect('error.userAdmin', 'user')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .addOrderBy('error.createTime', 'DESC')
            .getManyAndCount();
    }

    static async getWaitCount(productIds: Array<string>) {
        if (productIds.length < 1) {
            productIds = [''];
        }
        return ErrorOrderUser.query('error')
            .where({productId: In(productIds)})
            .andWhere('error.isDeal = :isDeal', {isDeal: false})
            .getCount();
    }

    static async getSiteWaitCount(productIds: Array<string>) {
        if (productIds.length < 1) {
            productIds = [''];
        }
        return ErrorOrderUser.query('error')
            .where({productId: In(productIds)})
            .andWhere('error.isDeal = :isDeal', {isDeal: false})
            .getCount();
    }

    static async siteAll(productIds: Array<string>, page: any) {
        if (productIds.length < 1) {
            productIds = [''];
        }
        return ErrorOrderUser.query('error')
            .where({productId: In(productIds)})
            .leftJoinAndSelect('error.order', 'order')
            .leftJoinAndSelect('error.userSite', 'user')
            .skip((page.currentPage - 1) * page.pageSize)
            .take(page.pageSize)
            .addOrderBy('error.createTime', 'DESC')
            .getManyAndCount();
    }

    static async allByOrderId(orderId: string) {
        return ErrorOrderUser.query('error')
            .innerJoin('error.order', 'order', 'order.id = :id', {id: orderId})
            .addOrderBy('error.createTime', 'DESC')
            .getMany();
    }

    static async clearErrorOrderUser() {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(ErrorOrderUser)
            .where('orderId IS NULL')
            .execute();
    }

}



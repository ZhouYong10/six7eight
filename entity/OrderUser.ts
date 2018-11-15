import {
    Column,
    CreateDateColumn,
    Entity, getRepository,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {ConsumeUser} from "./ConsumeUser";
import {ProfitUser} from "./ProfitUser";
import {ProfitSite} from "./ProfitSite";
import {decimal, myDateFromat} from "../utils";
import {Site} from "./Site";
import {User} from "./User";
import {ProductSite} from "./ProductSite";
import {ProductTypeSite} from "./ProductTypeSite";
import {WitchType} from "./ProductTypeBase";

export enum OrderStatus {
    Wait = 'order_wait',
    Execute = 'order_execute',
    Finish = 'order_finish',
    Refund = 'order_refund'
}

@Entity()
export class OrderUser {
    // 订单ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 订单创建时间
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

    // 订单开始执行时间
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

    // 订单结束执行时间
    @Column({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        nullable:true
    })
    finishTime?: string;

    // 订单单价
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    price!: number;

    // 订单执行初始量
    @Column({
        nullable: true
    })
    startNum?: number;

    // 订单数量
    @Column()
    num!: number;

    // 订单其余字段
    @Column('simple-json')
    fields!: any;

    // 订单总价
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    totalPrice!: number;

    // 订单执行进度
    @Column({
        type: 'decimal',
        precision: 3,
        scale: 1
    })
    progress: number = 0;

    // 订单状态
    @Column({
        type: "enum",
        enum: OrderStatus
    })
    status: OrderStatus = OrderStatus.Wait;

    // 金牌代理给超级代理的返利金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    })
    profitToSuper!: number;

    // 超级代理给顶级代理的返利金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4,
        nullable: true
    })
    profitToTop!: number;

    // 顶级代理给分站的返利金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    profitToSite!: number;

    // 分站给平台的返利金额
    @Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    })
    profitToPlatform!: number;

    // 订单消费和退款记录
    @OneToMany(type => ConsumeUser, consumeUser => consumeUser.order)
    consumes?: ConsumeUser[];

    // 订单所属分站
    @ManyToOne(type => Site, site => site.ordersUser)
    site!: Site;

    // 订单所属账户
    @ManyToOne(type => User, user => user.orders)
    user!: User;

    // 订单所属产品类别
    @ManyToOne(type => ProductTypeSite, productTypeSite => productTypeSite.orders)
    productType!: ProductTypeSite;

    // 订单所属产品
    @ManyToOne(type => ProductSite, productSite => productSite.orders)
    product!: ProductSite;

    // 订单返利给上级的记录
    @OneToMany(type => ProfitUser, profitUser => profitUser.order)
    profitsUser?: ProfitUser[];

    // 订单返利给分站的记录
    @OneToOne(type => ProfitSite, profitSite => profitSite.order)
    @JoinColumn()
    profitSite?: ProfitSite;

    countTotalPriceAndProfit(price: number, num: number, product: ProductSite) {
        this.price = price;
        this.num = num;
        this.totalPrice = parseFloat(decimal(price).times(num).toFixed(4));
        this.profitToSuper = parseFloat(decimal(product.goldPrice).minus(product.superPrice).times(num).toFixed(4));
        this.profitToTop = parseFloat(decimal(product.superPrice).minus(product.topPrice).times(num).toFixed(4));
        this.profitToSite = parseFloat(decimal(product.topPrice).minus(product.sitePrice).times(num).toFixed(4));
        if (product.type === WitchType.Platform) {
            this.profitToPlatform = parseFloat(decimal(product.sitePrice).minus(<number>product.price).times(num).toFixed(4));
        }else{
            this.profitToPlatform = 0;
        }
    }


    private static p() {
        return getRepository(OrderUser);
    }

    async save() {
        return await OrderUser.p().save(this);
    }

    private static query(name: string) {
        return OrderUser.p().createQueryBuilder(name);
    }

    static async update(id: string, product:any) {
        return await OrderUser.p().update(id, product);
    }

    static async findById(id: string){
        return await OrderUser.p().findOne(id);
    };

    static async findOrdersByUserAndProduct(productId: string, userId: string) {
        return await OrderUser.query('order')
            .innerJoin('order.product', 'product', 'product.id = :productId', {productId: productId})
            .innerJoin('order.user', 'user', 'user.id = :userId', {userId: userId})
            .addOrderBy('order.createTime', 'DESC')
            .getMany();
    }

    static async findOrdersByProduct(productId: string) {
        return await OrderUser.query('order')
            .innerJoin('order.product', 'product', 'product.id = :productId', {productId: productId})
            .addOrderBy('order.createTime', 'DESC')
            .getMany();
    }
}
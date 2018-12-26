import {
    Column,
    CreateDateColumn,
    Entity,
    getRepository,
    PrimaryGeneratedColumn
} from "typeorm";
import {myDateFromat} from "../utils";

@Entity()
export class ProductField{
    // 字段ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

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

    // 字段名称
    @Column({
        unique: true
    })
    name!: string;

    // 字段类型
    @Column({
        unique: true
    })
    type!: string;



    private static p() {
        return getRepository(ProductField);
    }

    async save() {
        return await ProductField.p().save(this);
    }

    private static query(name: string) {
        return ProductField.p().createQueryBuilder(name);
    }

    static async getAll() {
        return await ProductField.query('field')
            .orderBy('field.createTime', 'ASC')
            .getMany();
    }

    static async update(id: string, type:any) {
        return await ProductField.p().update(id, type);
    }

    static async delById(id: string) {
        return await ProductField.p().delete(id);
    }

    static async findByName(name: string){
        return await ProductField.p().findOne({name: name});
    };

    static async findById(id: string){
        return await ProductField.p().findOne(id);
    };
}
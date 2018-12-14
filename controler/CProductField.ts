import {ProductField} from "../entity/ProductField";


export class CProductField {
    static async getAll() {
        return await ProductField.getAll();
    }

    static async findByName(name: string) {
        return await ProductField.findByName(name);
    }

    private static async editInfo(field: ProductField, info: any) {
        field.name = info.name;
        field.type = info.type;
        return field;
    }

    static async add(info: any, io: any) {
        let field = await CProductField.editInfo(new ProductField(), info);
        field = await field.save();
        // 发送到商品字段页面
        io.emit('addField', field);
    }

    static async update(info: any, io: any) {
        let field = await CProductField.editInfo(<ProductField>await ProductField.findById(info.id), info);
        field = await field.save();
        // 发送到商品字段页面
        io.emit('updateField', field);
    }

    static async delById(id: string) {
        await ProductField.delById(id);
    }

}

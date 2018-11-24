import {ProductSite} from "../entity/ProductSite";
import {CProductTypeSite} from "./CProductTypeSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";
import {ProductTypeSite} from "../entity/ProductTypeSite";


export class CProductSite {
    static async getAll(siteId: string) {
        return await ProductSite.getAll(siteId);
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        let product = <ProductSite>await ProductSite.findById(id);
        product.onSale = onSale;
        return await product.save();
    }

    static async findById(id: string) {
        return await ProductSite.findById(id);
    }

    static async findByNameAndTypeId(typeId: string, name: string) {
        return await ProductSite.findByNameAndTypeId(typeId, name);
    }

    static async getPrototypeById(id: string) {
        return await ProductSite.getPrototypeById(id);
    }

    private static async editInfo(product: ProductSite, info: any) {
        product.name = info.name;
        product.sitePrice = info.sitePrice;
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;
        product.orderTip = info.orderTip;
        product.onSale = info.onSale;
        product.minNum = info.minNum;
        product.speed = info.speed;
        product.attrs = info.attrs;
        product.productTypeSite = <ProductTypeSite>await CProductTypeSite.findById(info.productTypeId);
    }

    static async add(info: any, site:Site, io: any) {
        let product = new ProductSite();
        await CProductSite.editInfo(product, info);
        product.site = site;
        await getManager().transaction(async tem => {
            product = await tem.save(product);

            let roleUserSite = <RoleUserSite>await tem.createQueryBuilder()
                .select('role')
                .from(RoleUserSite, 'role')
                .innerJoin('role.site', 'site', 'site.id = :id', {id: site.id})
                .where('role.type = :type', {type: RoleUserSiteType.Site})
                .getOne();

            roleUserSite.addProductToRights(product.productTypeSite.id, product.id);
            await tem.save(roleUserSite);

            let productMenuRight = product.menuRightItem();
            // 更新分站系统管理员页面导航栏
            io.emit(roleUserSite.id + 'product', {typeId: product.productTypeSite.id, product: productMenuRight});
            // 更新分站用户页面导航栏
            io.emit(site.id + 'product', {typeId: product.productTypeSite.id, product: productMenuRight});
            // 添加商品到分站商品管理页面
            io.emit(site.id + 'addProduct', product);
        });
    }

    static async update(info: any) {
        let product = <ProductSite>await ProductSite.findById(info.id);
        await CProductSite.editInfo(product, info);
        return await product.save();
    }

    static async updatePlatform(info: any) {
        let product = <ProductSite>await ProductSite.findById(info.id);
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;

        return await product.save();
    }
}

import {ProductTypeSite} from "../entity/ProductTypeSite";
import {ProductSite} from "../entity/ProductSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";
import {productToRight} from "../utils";


export class CProductTypeSite {
    static async getAll(siteId: string) {
        return await ProductTypeSite.getAll(siteId);
    }

    static async productsRight(siteId: string) {
        let types = await ProductTypeSite.allWithProducts(siteId);
        console.log(types, ' -----------------------------')
        return productToRight(types, []);
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        let type = <ProductTypeSite> await ProductTypeSite.findById(id);
        type.onSale = onSale;
        return await type.save();
    }

    static async findByName(name: string) {
        return await ProductTypeSite.findByName(name);
    }

    static async findById(id: string) {
        return await ProductTypeSite.findById(id);
    }

    static async add(info: any, site: Site, io:any) {
        let type = new ProductTypeSite();
        type.site = site;
        type.name = info.name;
        type.onSale = info.onSale;
        await getManager().transaction(async tem => {
            type = await tem.save(type);

            let roleUserSite = <RoleUserSite>await tem.createQueryBuilder()
                .select('role')
                .from(RoleUserSite, 'role')
                .innerJoin('role.site', 'site', 'site.id = :id', {id: site.id})
                .where('role.type = :type', {type: RoleUserSiteType.Site})
                .getOne();

            roleUserSite.addProductTypeToRights(type.id);
            await tem.save(roleUserSite);

            let typeMenuRight = type.menuRightItem();
            // 更新分站系统管理员页面导航栏
            io.emit(roleUserSite.id + 'type', typeMenuRight);
            // 更新分站用户页面导航栏
            io.emit(site.id + 'type', typeMenuRight);
        });
        return type;
    }

    static async update(info: any) {
        let type = <ProductTypeSite>await ProductTypeSite.findById(info.id);
        type.name = info.name;
        type.onSale = info.onSale;
        return await type.save();
    }

    static async delById(id: string) {
        let type = <ProductTypeSite>await ProductTypeSite.findByIdWithProducts(id);
        let products = <Array<ProductSite>>type.productSites;
        products.forEach(async (product) => {
            await ProductSite.delById(product.id);
        });
        await ProductTypeSite.delById(id);
    }
}

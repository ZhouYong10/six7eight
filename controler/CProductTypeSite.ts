import {ProductTypeSite} from "../entity/ProductTypeSite";
import {ProductSite} from "../entity/ProductSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";


export class CProductTypeSite {
    static async getAll(siteId: string) {
        return await ProductTypeSite.getAll(siteId);
    }

    static async getAllWithProducts(siteId: string) {
        return await ProductTypeSite.getAllWithProducts(siteId);
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await ProductTypeSite.update(id, {onSale: onSale});
    }

    static async findByName(name: string) {
        return await ProductTypeSite.findByName(name);
    }

    static async findById(id: string) {
        return await ProductTypeSite.findById(id);
    }

    private static async editInfo(type: ProductTypeSite, info: any) {
        type.name = info.name;
        type.onSale = info.onSale;

        return await type.save();
    }

    static async add(info: any, site: Site) {
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

            roleUserSite.addProductTypeToRights(type.menuRightItem());

            await tem.save(roleUserSite);
        });
        return type;
    }

    static async update(info: any) {
        return await CProductTypeSite.editInfo(<ProductTypeSite>await ProductTypeSite.findById(info.id), info);
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

import {ProductTypeSite} from "../entity/ProductTypeSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";
import {productToRight} from "../utils";
import {ProductSite} from "../entity/ProductSite";
import {UserSite} from "../entity/UserSite";


export class CProductTypeSite {
    static async getAll(productTypeIds: Array<string>) {
        return await ProductTypeSite.getAll(productTypeIds);
    }

    static async productsPrice(siteId: string) {
        let productTypes: Array<any> = await ProductTypeSite.allWithProducts(siteId);
        productTypes = productTypes.map((type: ProductTypeSite) => {
            return type.productSites!.map((product: ProductSite, index:number) => {
                return {
                    typeName: type.name,
                    name: product.name,
                    topPrice: product.topPrice,
                    superPrice: product.superPrice,
                    goldPrice: product.goldPrice,
                    nums: index === 0 ? type.productSites!.length : null
                }
            });
        });
        productTypes = [].concat(...productTypes);
        return productTypes;
    }

    static async productsRight(siteId: string) {
        let types = await ProductTypeSite.allWithProducts(siteId);
        return productToRight(types, []);
    }

    static async isPlatformTypeOnsale(typeId: string) {
        let type = await ProductTypeSite.findByIdWithProductType(typeId);
        // @ts-ignore
        return type.productType.onSale;
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        let type = <ProductTypeSite> await ProductTypeSite.findByIdWithProductType(id);
        type.onSale = onSale;
        return await type.save();
    }

    static async findByName(name: string) {
        return await ProductTypeSite.findByName(name);
    }

    static async findById(id: string) {
        return await ProductTypeSite.findByIdWithProductType(id);
    }

    static async add(info: any, user: UserSite, io:any) {
        let site = <Site>user.site;
        await getManager().transaction(async tem => {
            let type = new ProductTypeSite();
            type.site = site;
            type.name = info.name;
            type.createUser = user.username;
            type.onSale = info.onSale;
            type.sortNum = info.sortNum;
            type = await tem.save(type);

            user.role.addProductTypeToRights(type.id);
            await tem.save(user.role);

            let typeMenuRight = type.menuRightItem();
            // 更新分站当前角色的所有管理员页面导航栏
            io.emit(user.role.id + 'type', typeMenuRight);
            // 添加商品类别到分站当前角色的所有管理员商品类别管理页面
            io.emit(user.role.id + 'addType', type);

            if (user.role.type !== RoleUserSiteType.Site) {
                let roleUserSite = <RoleUserSite>await tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUserSite, 'role')
                    .innerJoin('role.site', 'site', 'site.id = :id', {id: site.id})
                    .where('role.type = :type', {type: RoleUserSiteType.Site})
                    .getOne();

                roleUserSite.addProductTypeToRights(type.id);
                await tem.save(roleUserSite);
                // 更新分站系统管理员页面导航栏
                io.emit(roleUserSite.id + 'type', typeMenuRight);
                // 添加商品类别到分站系统管理员商品类别管理页面
                io.emit(roleUserSite.id + 'addType', type);
            }

            // 更新分站用户页面导航栏
            io.emit(site.id + 'type', typeMenuRight);
        });
    }

    static async update(info: any) {
        let type = <ProductTypeSite>await ProductTypeSite.findByIdWithProductType(info.id);
        type.name = info.name;
        type.onSale = info.onSale;
        type.sortNum = info.sortNum;
        return await type.save();
    }
}

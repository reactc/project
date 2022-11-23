import request from '@/utils/request';

//获取图片接口 
//  get     /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//获取销售属性的接口
//  get     /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

//获取平台属性的数据
//   get    /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加sku
//     /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo });







//sku列表的接口
//    /admin/product/list/{page}/{limit}
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });

//上架
//    /admin/product/onSale/{skuId}
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });

//上架
//       /admin/product/cancelSale/{skuId}
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });

// 获取sku详情的接口
//   /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})
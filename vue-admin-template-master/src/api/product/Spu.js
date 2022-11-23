
import request from '@/utils/request'

// 获取SPU列表数据的接口
//    /admin/product/{page}/{limit}       get page limit category3Id

export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });


//  获取spu信息
//     /admin/product/getSpuById/{spuId}

export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

//  获取品牌信息
//   /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' });

//  获取spu图标接口
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//  获取平台销售属性
//   /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });

//  修改SPU||添加spu：对于修改或者添加，携带给服务器参数大致一样，惟一的区别是否携带id
//       /admin/product/saveSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) => {
    //携带的参数带有id----修改spu
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
    } else {
        //携带的参数不带id---添加spu
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
    }
};

//删除spu
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });

//获取spu列表数据的接口
//  /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });

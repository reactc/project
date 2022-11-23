//品牌管理数据 
import request from '@/utils/request';
//获取品牌列表接口
// 
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//处理添加品牌操作
//新增品牌：/admin/product/baseTrademark/save  banner
//对于新增的品牌，给服务器传输局，不需要传递ID，ID由服务器生成


//修改品牌的参数
//  /admin/product/baseTrademark/update   携带三个参数：id，品牌名称，品牌logo
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
    // 带给服务器数据携带ID--修改
    if (tradeMark.id) {
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark});
    }else{
        //新增品牌
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark});
    }
};

//删除品牌
///admin/cms/banner/remove/{id} delete
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});
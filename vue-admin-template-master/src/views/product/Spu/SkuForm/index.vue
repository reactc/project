<template>
    <div>
        <el-form ref="form" label-width="80px">
            <el-form-item label="SPU名称">
                {{ spu.spuName }}
            </el-form-item>
            <el-form-item label="SKU名称">
                <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)" type="number">
                <el-input placeholder="价格(元)" v-model="skuInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="重量(千克)">
                <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
            </el-form-item>

            <el-form-item label="规格描述">
                <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>

            <el-form-item label="平台属性">
                <el-form :inline="true" label-width="80px">
                    <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                                v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
                        <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
                            <el-option :label="saleAttrValue.saleAttrValueName"
                                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="图片列表">
                <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" prop="prop" width="80"></el-table-column>
                    <el-table-column prop="prop" label="图片">
                        <template slot-scope="{row,$index}">
                            <img :src="row.imgUrl" style="width:100px;height:100px">
                        </template>
                    </el-table-column>

                    <el-table-column prop="imgName" label="名称" width=""></el-table-column>

                    <el-table-column prop="prop" label="操作" width="">
                        <template slot-scope="{ row, $index }">
                            <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认
                            </el-button>
                            <el-button v-else>默认</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

export default {
    name: "",
    data() {
        return {
            //存贮图片的信息
            spuImageList: [],
            // 存储销售属性
            spuSaleAttrList: [],
            //获取平台属性的数据
            attrInfoList: [],
            //手机sku数据的字段
            skuInfo: {
                //第一类数据，父组件给的数据
                category3Id: 0,
                tmId: 0,
                spuId: 0,
                // 第二类，需要通过数据双向绑定v-model收集
                skuName: "",
                price: 0,
                weight: "",
                skuDefaultImg: "",
                skuDesc: "",
                //第三类，需要自己写代码
                //默认图片
                skuDefaultImg: "",
                //收集图片的字段
                skuImageList: [
                    {
                        // id: 0,
                        // imgName: "string",
                        // imgUrl: "string",
                        // isDefault: "string",
                        // skuId: 0,
                        // spuImgId: 0
                    },
                ],
                // 平台属性
                skuAttrValueList: [
                    {
                        // attrId: 0,
                        // valueId: 0,
                    },
                ],
                //销售属性
                skuSaleAttrValueList: [
                    {
                        // id: 0,
                        // saleAttrId: 0,
                        // saleAttrName: "string",
                        // saleAttrValueId: 0,
                        // saleAttrValueName: "string",
                        // skuId: 0,
                        // spuId: 0,
                    },
                ],
            },
            spu: {},
            //收集图片的数据字段，但是需要注意，收集的数据缺少isDefault字段，需要整理参数
            imageList: [],
        };
    },
    methods: {

        // 获取skuForm数据
        async getData(category1Id, category2Id, spu) {
            //收集父组件盒子的数据
            this.skuInfo.category3Id = spu.category3Id;
            this.skuInfo.spuId = spu.id;
            this.skuInfo.tmId = spu.tmId;
            this.spu = spu;
            // alert(123);
            //获取图片的数据
            let result = await this.$API.spu.reqSpuImageList(spu.id);
            // console.log(result);
            if (result.code == 200) {
                let list = result.data;
                list.forEach(item => {
                    item.isDefault = 0;
                });
                this.spuImageList = list;
            }

            //获取销售属性的数据
            let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id);
            // console.log(result1);
            if (result.code == 200) {
                this.spuSaleAttrList = result1.data;
            }
            //获取平台属性的数据
            let result2 = await this.$API.sku.reqAttrInfoList(
                category1Id,
                category2Id,
                spu.category3Id
            );
            if (result.code == 200) {
                this.attrInfoList = result2.data;
            }

        },
        //table表格复选框事件
        handleSelectionChange(params) {
            //获取用户选中图片信息数据，但是缺少isDefault字段
            this.imageList = params;
        },
        //排他操作
        changeDefault(row) {
            //图片列表的数据的isDefault变为0
            this.spuImageList.forEach(item => {
                item.isDefault = 0;
            });
            // 点击的那个图片数据变为1
            row.isDefault = 1;
            //收集默认图片的地址
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        //取消
        cancel() {
            //自定义事件，让父组件切换场景为0
            this.$emit('changeScenes', 0);
            Object.assign(this._data, this.$options.data());
        },
        //保存按钮的回调
        async save() {
            //整理参数
            //整理平台属性
            const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
            //整理平台的数据
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(":");
                    prev.push({ attrId, valueId });
                }
                return prev;
            }, []);

            //整理销售的属性
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId;
                    prev.push({ saleAttrId, saleAttrValueId })
                }
                return prev;
            }, []);

            //整理图片的数据
            skuInfo.skuImageList = imageList.map(item => {
                return {
                    imageName: item.imageName,
                    imgUrl: item.isDefault,
                    isDefault: item.isDefault,
                    spuImgId: item.id,
                }
            });

            //发请求
            let result = await this.$API.sku.reqAddSku(skuInfo);
            if (result.code == 200) {
                this.$message({ type: 'success', message: '成功' });
                this.$emit('changeScenes', 0);
            }
            // // 新建数据
            // let arr = [];
            // attrInfoList.forEach(item => {
            //     if (item.attrIdAndValueId) {
            //         const [attrId, valueId] = item.attrIdAndValueId.split(":");
            //         //携带给服务器参数应该是对象
            //         let obj = { valueId, attrId };
            //         arr.push(obj);
            //     }
            // });
            // //将整理好的数据赋值给skuInfo.skuAttrValueList
            // skuInfo.skuAttrValueList = arr;
        }
    },
};
</script>

<style>

</style>
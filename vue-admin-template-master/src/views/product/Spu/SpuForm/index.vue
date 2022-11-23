<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlerSuccess"
          :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>

        <el-button type="primary" icon="el-icon-puls" :disabled="!attrIdAndAttrName" @click="addSaleAttr">
          添加销售属性</el-button>

        <el-table border style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column type="index" prop="" label="序号" width="80px" align="center"></el-table-column>

          <el-table-column prop="saleAttrName" label="属性名" width="" align="center"></el-table-column>

          <el-table-column prop="" label="属性值名称列表" width="" align="center">
            <template slot-scope="{ row, $index }">
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable
                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 底下结构可以当做span和input切换 -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput"
                size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSakeAttrValue(row)">添加
              </el-button>
            </template>
          </el-table-column>

          <el-table-column prop="" label="操作" width="" align="center">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
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
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类Id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        // 平台Id
        tmId: "",
        // 收集spu图片的信息
        spuImageList: [
          {
            // id: 0,
            // imgName: "string",
            // imgUrl: "string",
            // spuId: 0
          },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     saleAttrName: "string",
          //     spuId: 0,
          //     spuSaleAttrValueList: [
          //         {
          //             baseSaleAttrId: 0,
          //             id: 0,
          //             isChecked: "string",
          //             saleAttrName: "string",
          //             saleAttrValueName: "string",
          //             spuId: 0
          //         }
          //     ]
          // }
        ],
      }, //存储spu信息属性
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片的数据
      saleAttrList: [], //销售属性列表
      attrIdAndAttrName: "", //手机未选择的销售属性的Id
    };
  },
  methods: {
    //照片墙删除某一个图片触发
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      //收集照片墙图片数据
      //对于已有的图片[照片墙中已有的数据，有name，url字段]，必须要有这两个属性
      this.spuImageList = fileList;
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      //将图片地址赋值给属性
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //初始化spuForm数据
    async initSpuData(spu) {
      //获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      // console.log(spuResult);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listAttr = spuImageResult.data;
        //由于照片墙显示的图片的数据需要数组，数组的元素需要有name和url字段
        // 需要把服务器返回的数据进行修改
        listAttr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据复制给spuImageList
        this.spuImageList = listAttr;
      }

      //获取平台销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //照片墙上传成功的回调
    handlerSuccess(respon, file, fileList) {
      console.log(respon, file, fileList);
    },
    //添加销售属性
    addSaleAttr() {
      //已经收集需要添加的属性销售属性的信息
      //把收集道德销售属性进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向spu对象spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndAttrName = "";
    },
    //添加按钮的回调
    addSakeAttrValue(row) {
      //点击销售属性当中添加按钮的时候，需要由button变为input，通过当前销售属性的inputVisible控制
      // 挂在在销售属性身上的响应式数据inputVisible，控制button和input字段
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputVisible手机新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    //el-input是去焦点
    handleInputConfirm(row) {
      //解构出销售属性中的数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) return this.$message("属性值不能重复");
      //新增的销售的属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      // 修改inputVisible的值为false
      row.inputVisible = false;
    },
    //保存按钮回调
    async addOrUpdateSpu() {
      //整理参数,照片墙数据
      //对于图片需要携带imageName和imageUrl
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件回到0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
      }
      // 清楚数据
      Object.assign(this._data, this.$options.data());
    },
    //点击添加spu按钮的时候，发请求
    async addSpuData(category3Id) {
      //添加spu的时候收集三级分类的id
      this.spu.category3Id = category3Id;
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取平台销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮
    cancel() {
      //取消按钮的回调，通知父亲切换场景为0
      this.$emit("changeScene", { scene: 0, flag: "" });
      // 清楚数据
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //及选出还未选择的销售属性
    unSelectSaleAttr() {
      //整个平台的销售属性一共有三个：颜色，尺寸，版本--saleAttrList
      // 当前spu拥有的属于自己的spu属性  ----颜色
      let result = this.saleAttrList.filter((item) => {
        //every数组的方法，会返回一个布尔值[真|假]
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      // this.saleAttrList.filter(item=>{
      //     console.log(item);
      // })
      return result;
    },
  },
};
</script>

<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
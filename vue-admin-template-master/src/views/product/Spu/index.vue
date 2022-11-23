<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里将来是有三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column prop="description" label="SPU描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)">
              </HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改sku" @click="updateSpu(row)">
              </HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前全部sku列表" @click="handler(row)">
              </HintButton>

              <el-popover placement="top" width="160">
                <p>这是一段内容这是一段内容确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteSpu(row)">确定</el-button>
                </div>
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除sku" slot="reference">
                </HintButton>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination style="text-align: center" :total="20" :current-page="1" :page-sizes="[3, 5, 10]" :page-size="3"
          layout="prev,pager,next,jumper,->,sizes,total" @current-change="getSpuList" @size-change="handlesSizeChange">
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu">
      </SpuForm>
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>

    <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table展示sku列表 -->
      <el-table :data="skuList" border style="width:100%" v-loading="loading">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import HintButton from "@/components/HintButton/index.vue";
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "spuIndex",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true,
      page: 1,
      limit: 3,
      records: [],
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示sku列表数据
      dialogTableVisible: false,//控制对话框的显示与隐藏
      spu: {},
      skuList: [],//存储sku列表的数据
      loading: true,
    };
  },
  components: { HintButton, SpuForm, SkuForm },
  methods: {
    // 三级联动的自定义事件，可以把子组件的数据的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId：获取一级二级三级分类Id
      //Level：获取的是几级Id
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取spu列表数据进行展示
        this.getSpuList();
      }
    },
    //获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total == result.data.total;
        this.records = result.data.records;
      }
    },
    // //点击分页器第几页按钮的回调
    // handelCurrentChange(page) {
    //     this.page = page;
    //     this.getSpuList();
    // }

    //分页器的某一页展示数据条数发生变化的时候
    handlesSizeChange(limit) {
      //修改参数
      this.limit = limit;
      //发请求
      this.getSpuList();
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //吸怪某一个spu
    updateSpu(row) {
      this.scene = 1;
      //获取spuForm子组件
      //在父组件当中可以通过$ref获取子组件
      this.$refs.spu.initSpuData(row);
    },
    //自定义时间回调
    changeScene({ scene, flag }) {
      //flag是为了区分保存按钮是添加还是修改
      // 切换结构（场景）
      this.scene = scene;
      //子组件通知父组件切换场景，需要再次获取spu列表的数据进行展示
      if ((flag = "修改")) {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功!" });
        //代表spu个数大于1删除的时候停留在当前页，如果spu个数小于1 回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加sku的回调
    addSku(row) {
      this.scene = 2;
      // alert(123)
      //父组件调用子组件的方法，让子组件发请求------三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //skuform通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },

    //查看spu按钮的回调
    async handler(spu) {
      //点击按钮的时候，对话框可见
      this.dialogTableVisible = true;
      this.spu = spu;
      // console.log(spu);
      // 获取spu列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      // console.log(result);
      if (result.code == 200) {
        // console.log(result.data);
        this.skuList = result.data;
        //loading隐藏
        this.loading = false;
      }
    },
    //关闭对话框的回调
    close(done) {
      //loading属性再次变为真
      this.loading = true;
      this.skuList = [];
      //关闭对话框
      done();
    }
  },
};
</script>

<style>

</style>
<template>
    <div>
        <el-card style="margin: 20px 0px">
            <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
                </el-button>
                <!-- 表格-展示属性 -->
                <el-table style="width: 100%" border :data="attrList">
                    <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
                    <el-table-column prop="prop" label="属性值列表" width="width">
                        <template slot-scope="{ row, $index }">
                            <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id"
                                style="margin: 0px 20px">{{ attrValue.valueName }}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="150">
                        <template slot-scope="{ row, $index }">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">
                            </el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加属性|修改属性的结构 -->
            <div v-show="!isShowTable">
                <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
                </el-button>
                <el-button @click="isShowTable = true">取消</el-button>
                <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
                    <el-table-column align="center" type="index" label="序号" width="80"></el-table-column>
                    <el-table-column prop="prop" label="属性值名称" width="width">
                        <template slot-scope="{ row, $index }">
                            <!-- 这里是span和input来蝴蝶切换 -->
                            <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag"
                                @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
                            <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{ row, $index }">
                            <!-- 气泡确认框 -->
                            <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存
                </el-button>
                <el-button @click="isShowTable = true">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "attrIndex",
    data() {
        return {
            category1Id: "",
            category2Id: "",
            category3Id: "",
            //接受平台属性的字段
            attrList: [],
            // 控制table表格的显示和隐藏
            isShowTable: true,
            //收集新增属性|修改属性使用
            attrInfo: {
                attrName: "",
                attrValueList: [
                    //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
                    // {
                    //     attrId: 0,//相应属性名的id
                    //     valueName: "",
                    // },
                ],
                categoryId: 0, //三级分类的id
                categoryLevel: 3, //因为服务器也需要区分几级id
            },
        };
    },
    methods: {
        //自定义时间回调
        getCategoryId({ categoryId, level }) {
            //区分三级分类相应的id，以及父组件进行存储
            if (level == 1) {
                this.category1Id = categoryId;
                this.category2Id = "";
                this.category3Id = "";
            } else if (level == 2) {
                this.category2Id = categoryId;
            } else {
                this.category3Id = categoryId;
                this.getAttrList();
            }
        },
        //获取平台属性的数据
        async getAttrList() {
            //获取分类ID
            const { category1Id, category2Id, category3Id } = this;
            let result = await this.$API.attr.reqAttrList(
                category1Id,
                category2Id,
                category3Id
            );
            this.attrList = result.data;
        },
        //添加属性值
        addAttrValue() {
            //向属性值的数组里面添加元素
            //attrId:是你相应的属性的Id,且目前没有相应的属性的id，目前而言带给服务器的id为undefined
            //valueName：相应的属性值得名称
            this.attrInfo.attrValueList.push({
                //对于修改某一个属性的时候，可以再已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性值的id带上）
                attrId: this.attrInfo.id,
                valueName: "",
                flag: true,
            });
            this.$nextTick(() => {
                this.$refs[this.attrInfo.attrValueList.length - 1].focus();
            });
        },
        //添加属性按钮的回调
        addAttr() {
            //且换table显示与隐藏
            this.isShowTable = false;
            //清楚数据
            this.attrInfo = {
                attrName: "",
                attrValueList: [
                    //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
                    // {
                    //     attrId: 0,//相应属性名的id
                    //     valueName: "",
                    // },
                ],
                categoryId: this.category3Id, //三级分类的id
                categoryLevel: 3, //因为服务器也需要区分几级id
            };
        },
        //修改某一个属性
        updateAttr(row) {
            // console.log(row);
            //isShowTable变为false
            this.isShowTable = false;
            //将选中的属性复制给attrInfo
            //由于数据结构中存在对象里面套数组，数组里面有对象，因此需要深拷贝解决问题
            this.attrInfo = cloneDeep(row);

            //再修改某一个属性的时候，将相应的属性值元素添加上flag这个比哦啊标记
            this.attrInfo.attrValueList.forEach((item) => {
                //这样书写也可以给属性值添加flag自动，但是会发现视图不会更新(因为flag不是响应式数据)
                // 因为vue无法探测普通的新增property，这样书写并非响应式属性（数据变化视图和这边）
                this.$set(item, "flag", false);
            });
        },
        //失去焦点的事件---切换为查看模式，展示span
        toLook(row) {
            //如果属性值为空 不能作为新的属性值，需要给用户提示，输入一个其他属性
            if (row.valueName.trim() == "") {
                this.$message("请你输入一个正常的属性值");
                return;
            }
            //新增的属性值不能与已有的属性值相同
            let isRepat = this.attrInfo.attrValueList.some((item) => {
                //需要将row从数组里面便利出来
                // row是最新新增的属性值【数组的最后一项元素】
                if (row != item) {
                    return row.valueName == item.valueName;
                }
            });
            // console.log(isRepat);
            if (isRepat) return;
            // row   当前用户添加最新的属性值
            //当前的编辑模式变为查看模式[让input消失，显示span]
            row.flag = false;
        },
        toEdit(row, index) {
            row.flag = true;
            //获取input节点，实现自动聚焦
            // $nextTick,当节点渲染完毕了，会执行一次
            this.$nextTick(() => {
                //获取相应的input表单元素实现聚焦
                this.$refs[index].focus();
            });
        },
        // 气泡确认框
        // 最新版本的ElementUI---2.15.6,目前模板中的版本号为2.13.x
        deleteAttrValue(index) {
            //当前属性值操作是不需要发请求的
            this.attrInfo.attrValueList.splice(index, 1);
        },
        //添加或者保存按钮
        async addOrUpdateAttr() {
            //整理参数:如果用户添加了很多属性值，并且属性值为空不应该提交服务器
            //提交服务器数据当中不应该出现flag字段
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
                (item) => {
                    //过滤掉属性值不是空的
                    if (item.valueName != "") {
                        //删除掉flag属性
                        delete item.flag;
                        return true;
                    }
                }
            );
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                //展示平台属性的信号量进行切换
                this.isShowTable = true;
                //提示消息
                this.$message({ type: "success", message: "保存成功" });
                //保存成功进行展示
                this.getAttrList();
            } catch (error) {
                this.$message("保存失败");
            }
        },
        //删除属性值
        async deleteAttr(row) {
            let result = await this.$API.attr.reqDeleteAttr(row.id);
            // console.log(result);
            if (result.code==200) {
                this.$message({ type: "success", message: "删除成功!" });
                this.getAttrList();
            }
        },
    },
};
</script>

<style>
</style>
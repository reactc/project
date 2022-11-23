<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px;" @click="showDialog">添加</el-button>
        <!-- 表格组件
        data:表格组件数据来源
        border:是给表格加边框
        column属性
        label:显示标题
        width:对应列的宽度
        align:标题的对其方式
        注意：elementUi中的table组件，展示数据是以一列一列进行展示数据
        -->
        <el-table style="width:100%" border :data="list">
            <el-table-column type="index" prop="prop" label="序号" width="width">

            </el-table-column>

            <el-table-column prop="tmName" label="品牌名称" width="width">

            </el-table-column>

            <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" style="width:100px;height:100px">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--
            分页器
            当前第几页，数据总条数，每一个展示条数，连续页码
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"

            current-page 代表当前是第几页
            total:代表分页器一共有多少条
            page-size"代表每一页需要展示多少条数据
            layout：可以实现分页器布局
            pager-count 按钮的数量、如果9 连续页码是 7 
        -->
        <el-pagination style="margin-top:20px;text-align: center;" :current-page="page" :total="total"
            :page-size="limit" :page-count="7" :page-sizes="[3, 5, 10]" @current-change="getPageList"
            @size-change="handleSizeChange" layout="prev,pager,next,jumper,->,sizes,total">

        </el-pagination>
        <!-- 
            对话框 
            :visible.sync 控制对话框显示和隐藏用的
            Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
            并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator
        -->
        <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <!-- form表单 mdoel属性，这个属性的作用是：
                把表单的数据收集到哪个对象的身上。将来进行表达那样这也能挂，需要这个属性 -->
            <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
                    <!-- 这里收集数据，不能使用v-mdoel，因为不是表单元素
                        action：设置图片上传的地址
                        :on-success:可以检查图片上传成功，当图片上传成功，会执行一次
                        :before-upload: 可以在上传图片之前，会执行一次
                    -->
                    <!-- :on-success="handleAvatarSuccess" 
                    :before-upload="beforeAvatarUpload" -->
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'tradeMark',
    data() {
        return {
            //代表的分页器第几页
            page: 1,
            //当前页数展示数据条数
            limit: 3,
            //列表的数据
            total: 0,
            //列表展示的数据
            list: [],
            //对话框显示与隐藏控制的属性
            dialogFormVisible: false,
            //上传图片使用的属性
            // imageUrl: '',
            //收集品牌信息：对象身上的属性，需要按照文档
            tmForm: {
                tmName: '',
                logoUrl: ''
            },
            // 表单验证规则
            rules: {
                tmName: [
                    //require是必须要校验的字段（前面五角星有关系） message提示信息 trigger ：用户行为设置（事件的blur，change当文本发生变化的时候)
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    // 品牌名称长度2-10
                    { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
                ],
                logoUrl: [
                    { required: true, message: '请选择品牌图片', trigger: 'change' }
                ],
            }
        };
    },
    mounted() {
        //获取列表数据方法
        this.getPageList();
    },
    methods: {
        //获取品牌列表的数据
        async getPageList(pager = 1) {
            this.page = pager;
            //解构出参数
            const { page, limit } = this;
            //获取品牌列表的接口
            let result = await this.$API.trademark.reqTradeMarkList(page, limit);
            // console.log(result);
            if (result.code == 200) {
                this.total = result.data.total;
                this.list = result.data.records;
            }
        },
        // 当分页器每一页需要展示数据条数发生变化的时候触发
        handleSizeChange(limit) {
            // console.log(limit);
            // 整理参数
            this.limit = limit;
            this.getPageList();
        },
        // 点击天极爱品牌的按钮
        showDialog() {
            // 显示对话框
            this.dialogFormVisible = true;
        },
        // 修改某一个品牌
        updateTradeMark(row) {
            // 显示对话框
            this.dialogFormVisible = true;
            // console.log(row);
            // 将已有的品牌信息赋值给tmForm进行展示
            //将服务器返回品牌的信息，直接复制给了tmForm进行展示
            this.tmForm = { ...row };
        },
        //上传图片相关的回调
        //图片上蹿成功
        handleAvatarSuccess(res, file) {
            // res:上传成功之后服务器返回的数据
            //file:上传成功之后服务器返回的前端数据
            // console.log(res);
            this.tmForm.logoUrl = res.data;
        },
        //图片上传之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //添加按钮(添加品牌、修改品牌)
        addOrUpdateTradeMark() {

            this.$refs.ruleForm.validate(async (success) => {
                // console.log(success);
                if (success) {
                    this.dialogFormVisible = false;
                    //发请求（添加|修改）
                    let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
                    if (result.code == 200) {
                        //弹出信息：添加品牌成功，修改品牌成功
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
                        });
                        //添加或者修改品牌成功之后，需要再次获得品牌列表展示
                        //吐过添加品牌：停留在第一页，修改品牌停留在当前
                        this.getPageList(this.tmForm.id ? this.page : 1);
                        // }
                    }
                } else {
                    console.log('error submit');
                    return false;
                }
            });
        },
        // 删除品牌信息
        deleteTradeMark(row) {
            //弹框
            this.$confirm(`你确定删除${row.tmName}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 当用户点击确定按钮时会触发
                //向服务器发请求
                let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
                // 如果删除成功
                // console.log(result);
                if (result.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //再次获取品牌列表数据
                    this.getPageList(this.list.length>1?this.page:this.page-1);
                }

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
    }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
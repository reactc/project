<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="6">
                <el-card>
                    <!-- 第一个card -->
                    <Detail title="总销售额" count="￥ 126560">
                        <template slot="charts">
                            <span>周总比&nbsp;&nbsp;56.67%<i class="el-icon-caret-top"></i></span>&nbsp;&nbsp;
                            <span>日同比&nbsp;&nbsp;19.16%<i class="el-icon-caret-bottom"></i></span>
                        </template>
                        <template slot="footer">
                            <span>日销售额￥ 12423</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <!-- 第二个card -->
                    <Detail title="访问量" count="88460">
                        <template slot="charts">
                            <lineCharts></lineCharts>
                        </template>
                        <template slot="footer">
                            <span>日访问量 1234</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <!-- 第三个card -->
                    <Detail title="支付笔数" count="88460">
                        <template slot="charts">
                            <barCharts></barCharts>
                        </template>
                        <template slot="footer">
                            <span>转换率 50%</span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <!-- 第四个card -->
                    <Detail title="运营活动效果" count="78%">
                        <template slot="charts">
                            <progressCharts></progressCharts>
                        </template>
                        <template slot="footer">
                            <span>周总比&nbsp;&nbsp;56.67%<i class="el-icon-caret-top"></i></span>&nbsp;&nbsp;
                            <span>日同比&nbsp;&nbsp;19.16%<i class="el-icon-caret-bottom"></i></span>
                        </template>
                    </Detail>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Detail from "./Detail";
import lineCharts from './lineChart';
import barCharts from './barCharts';
import progressCharts from './progressCharts';
export default {
    name: '',
    components: {
        Detail, lineCharts, barCharts, progressCharts
    }
}
</script>

<style scoped>
.el-icon-caret-top {
    color: red;
}

.el-icon-caret-bottom {
    color: greenyellow;
}
</style>
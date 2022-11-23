<template>
    <div>
        <div class="header">
            <span>用户搜索数</span>
            <i class="el-icon-warning-outline"></i>
        </div>
        <div class="main">
            <span class="main-title">12321</span>
            <span class="main-content">17.1</span>
            <i class="el-icon-caret-top" style="color:greenyellow"></i>
            <i class="el-icon-caret-bottom" style="color:red"></i>
        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:'',
    mounted() {
        //初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        //配置数据
        lineCharts.setOption({
            xAxis: {
                //隐藏x轴
                show: false,
                type: 'category',
            },
            yAxis: {
                //隐藏y轴
                show: false,
            },
            //系列
            series: [
                {
                    type: 'line',
                    data: [10, 7, 33, 12, 88, 9, 45, 66],
                    //拐点样式的设置
                    itemStyle: {
                        opacity: 0,
                    },
                    //线条的样式
                    lineStyle: {
                        color: "blue",
                    },
                    //填充颜色的设置
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "blue",  //0%处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "#fff",//100%处的颜色
                                }
                            ],
                            global: false,//缺省为false
                        }
                    }
                }
            ],
            //布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            }
        })
    },
}
</script>

<style>
.header {
    display: flex;
    align-items: center;
}

.search-header {
    margin-right: 20px;
}

.main {
    margin: 10px 0px;
}

.main-title {
    font-size: 20px;
    margin-right: 30px;
}

.main-content {
    margin-right: 10px;
}

.charts {
    width: 100%;
    height: 50px;
}
</style>
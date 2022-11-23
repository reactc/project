<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: '',
    mounted() {
        //初始化echarts实例
        let lineCharts = echarts.init(this.$refs.charts);
        //配置数据
        lineCharts.setOption({
            xAxis: {
                //隐藏x轴
                show: false,
                //均分
                type: 'category',
            },
            yAxis: {
                //隐藏y轴
                show: false,
            },
            //系列
            series: [
                {
                    //图标形式-柱状图
                    type: 'bar',
                    data: [10, 7, 33, 12, 88, 9, 45, 66,22,33],
                    color:'cyan',
                }
            ],
            //布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            tooltip:{}
        })
    },
}
</script>

<style>
.charts {
    width: 100%;
    height: 100%;
}
</style>
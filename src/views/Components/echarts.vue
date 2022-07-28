<template>
  <div style="width:600px;height:500px;background-color: #000;">
    <base-charts ref="baseChartsRef"></base-charts>
  </div>
  <br />
  <div style="width:600px;height:500px;background-color: #000;">
    <base-charts ref="baseChartsRefPlus"></base-charts>
  </div>
</template>

<script>
import baseCharts from "@/components/baseCharts.vue";
import { onMounted, ref } from 'vue';

export default {
  name: "basecharts",
  components: {
    baseCharts,
  },
  setup () {
    const baseChartsRef = ref(null)
    const baseChartsRefPlus = ref(null)
    onMounted(() => {
      let { defalutOptions, setOptions } = baseChartsRef.value
      defalutOptions.xAxis.data = ['深圳', '广州', '汕头']
      defalutOptions.series[0].data = [100, 200, 300]
      defalutOptions.series[1].data = [100, 200, 300]
      setOptions(defalutOptions, [
        "#4582ff", // 正面颜色渐变
        "#582ee8", // 正面颜色渐变
        "#638afa", // 侧面颜色渐变
        "#6757f1", // 侧面颜色渐变
        "#4c70fc", // 顶部颜色渐变
        "#4582ff", // 顶部颜色渐变
        "rgba(90,75,246,0.3)", // 底部颜色渐变
        "rgba(0,31,117,0.3)" // 底部颜色渐变
      ]);
      // 大小可调整
      baseChartsRefPlus.value.defalutOptions.xAxis.data = ['深圳', '广州', '汕头']
      baseChartsRefPlus.value.defalutOptions.series[0].data = [100, 200, 300]
      baseChartsRefPlus.value.defalutOptions.series[0].data = [100, 200, 300]
      baseChartsRefPlus.value.setOptions(baseChartsRefPlus.value.defalutOptions, [
        "#0079e4", // 正面颜色渐变
        "#000af5", // 正面颜色渐变
        "#36c9ff", // 侧面颜色渐变
        "#003efa", // 侧面颜色渐变
        "#0099e4", // 顶部颜色渐变
        "#4a9df7", // 顶部颜色渐变
        "rgba(0,31,117,0.3)", // 底部颜色渐变
        "rgba(0,153,228,0.3)" // 底部颜色渐变
      ], { offsetX: 36, sliderWidth: 16 })

    })
    return {
      baseChartsRef,
      baseChartsRefPlus
    };
  },
};
</script>

<style scoped>
.schart-box {
  display: inline-block;
  margin: 20px;
}
.schart {
  width: 600px;
  height: 400px;
}
.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>
<template>
  <div
    id="baseBarCharts"
    ref="echartsRef"
  ></div>
</template>
<script>
import { onMounted, ref } from "vue"
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: "barCharts",
  setup () {
    let baseEcharts = null
    let echartsRef = ref(null)
    let linearArr = [
      "#0079e4 ",
      "#000af5 ",
      "#36c9ff ",
      "#003efa",
      " #0099e4",
      " #4a9df7",
      " rgba(0, 31, 117, 0.3)",
      " rgba(0, 153, 228, 0.3)",
    ]
    function threeDimensionalLine (offsetX = 20, sliderWidth = 8, offsetTick = 14) {
      // 绘制左侧面
      const CubeLeft = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          // 会canvas的应该都能看得懂，shape是从custom传入的
          const xAxisPoint = shape.xAxisPoint
          const c0 = [shape.x - offsetTick, shape.y]
          const c1 = [shape.x - offsetTick + offsetX, shape.y]
          const c2 = [xAxisPoint[0] - offsetTick + offsetX, xAxisPoint[1]]
          const c3 = [xAxisPoint[0] - offsetTick, xAxisPoint[1]]
          ctx
            .moveTo(c0[0], c0[1])
            .lineTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .closePath()
        },
      })
      // 绘制右侧面
      const CubeRight = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [shape.x - offsetTick + offsetX, shape.y]
          const c2 = [shape.x - offsetTick + offsetX + sliderWidth, shape.y - sliderWidth]
          const c3 = [
            xAxisPoint[0] - offsetTick + offsetX + sliderWidth,
            xAxisPoint[1] - sliderWidth + 4,
          ]
          const c4 = [shape.x - offsetTick + offsetX, xAxisPoint[1]]
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .closePath()
        },
      })
      // 绘制顶面
      const CubeTop = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const c1 = [shape.x - offsetTick, shape.y]
          const c2 = [shape.x - offsetTick + offsetX, shape.y] // 右点
          const c3 = [shape.x - offsetTick + offsetX + sliderWidth, shape.y - sliderWidth]
          const c4 = [shape.x - offsetTick + sliderWidth, shape.y - sliderWidth]
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .lineTo(c1[0], c1[1])
            .closePath()
        },
      })

      const CubeBottom = echarts.graphic.extendShape({
        shape: {
          x: 0,
          y: 0,
        },
        buildPath: function (ctx, shape) {
          const xAxisPoint = shape.xAxisPoint
          const c1 = [xAxisPoint[0] - offsetTick, xAxisPoint[1]]
          const c2 = [xAxisPoint[0] - offsetTick, xAxisPoint[1] + 6] // 右点
          const c3 = [xAxisPoint[0] - offsetTick + offsetX + sliderWidth, xAxisPoint[1] + 6]
          const c4 = [xAxisPoint[0] - offsetTick + offsetX + sliderWidth, xAxisPoint[1] - 6]
          const c5 = [xAxisPoint[0] - offsetTick + offsetX, xAxisPoint[1]]
          ctx
            .moveTo(c1[0], c1[1])
            .lineTo(c2[0], c2[1])
            .lineTo(c3[0], c3[1])
            .lineTo(c4[0], c4[1])
            .lineTo(c5[0], c5[1])
            .lineTo(c1[0], c1[1])
            .closePath()
        },
      })
      // 注册三个面图形
      echarts.graphic.registerShape("CubeLeft", CubeLeft)
      echarts.graphic.registerShape("CubeRight", CubeRight)
      echarts.graphic.registerShape("CubeTop", CubeTop)
      echarts.graphic.registerShape("CubeBottom", CubeBottom)
    }
    let defalutOptions = ref({
      textStyle: {
        fontFamily: "PingFang",
      },
      grid: {
        top: "12%",
        left: "1%",
        right: "2%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [],
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#fff",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#3a79c2",
          },
        },
      },
      tooltip: {
        show: true,
        position: "bottom",
        backgroundColor: "#fff",
        textStyle: {
          color: "#000",
          //   fontStyle: "PingFang",
          fontSize: 12,
          //   fontWeight: "normal",
          lineHeight: 24,
        },
      },
      series: [
        {
          type: "custom",
          renderItem: (params, api) => {
            const location = api.coord([api.value(0), api.value(1)])
            return {
              type: "group",
              children: [
                {
                  type: "CubeLeft",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0]),
                  },
                  style: {
                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: linearArr[0],
                      },
                      {
                        offset: 1,
                        color: linearArr[1],
                      },
                    ]),
                  },
                },
                {
                  type: "CubeRight",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0]),
                  },
                  style: {
                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: linearArr[2],
                      },
                      {
                        offset: 1,
                        color: linearArr[3],
                      },
                    ]),
                  },
                },
                {
                  type: "CubeTop",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0]),
                  },
                  style: {
                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: linearArr[4],
                      },
                      {
                        offset: 1,
                        color: linearArr[5],
                      },
                    ]),
                  },
                },
                {
                  type: "CubeBottom",
                  shape: {
                    api,
                    xValue: api.value(0),
                    yValue: api.value(1),
                    x: location[0],
                    y: location[1],
                    xAxisPoint: api.coord([api.value(0), 0]),
                  },
                  style: {
                    fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: linearArr[6],
                      },
                      {
                        offset: 1,
                        color: linearArr[7],
                      },
                    ]),
                  },
                },
              ],
            }
          },
          data: [],
        },

        {
          type: "bar",
          label: {
            normal: {
              show: true,
              position: "top",
              fontSize: 12,
              color: "#fff",
            },
          },
          itemStyle: {
            color: "transparent",
          },
          data: [],
        },
      ],
    })
    onMounted(() => {
      baseEcharts = echarts.init(echartsRef.value)
      window.addEventListener(
        "resize",
        _.debounce(() => {
          baseEcharts.resize()
        }, 150)
      )
    })
    function setOptions (options, linerArrOptions, barWidth = {}) {
      linearArr = linerArrOptions
      if (barWidth.offsetX && barWidth.sliderWidth) {
        threeDimensionalLine(
          barWidth.offsetX,
          barWidth.sliderWidth,
          (barWidth.offsetX + barWidth.sliderWidth) / 2
        )
      } else {
        threeDimensionalLine()
      }
      baseEcharts.setOption(options, true)
    }
    return {
      echartsRef,
      setOptions,
      defalutOptions,
    }
  },
}
</script>
<style lang="scss" scoped>
#baseBarCharts {
  width: 100%;
  height: 100%;
}
</style>

import util from '../../$util/index';


Component({
    properties: {
        chartData: {
            type: Array,
            value: null
        },
        color: {
            type: String,
            value: '#62DB89'
        }
    },
    data: {
        opts: {
            onInit: null
        }
    },
    observers: {
        'chartData,color': function (chartData, color) {
            if (chartData) {
                this.setData({
                    'opts.onInit': this.createInitChart(chartData, color)
                });
            }
        }
    },

    methods: {
        createInitChart(data, color) {
            let chart = null;

            // 使用 F2 绘制图表
            const initChart = (canvas, width, height, F2) => {
                chart = new F2.Chart({
                    el: canvas,
                    width,
                    height,
                    appendPadding: [10, 0, 0, 0]
                });
                chart.source(data, {
                    label: {
                        type: 'timeCat',
                        tickCount: 6,
                        mask: 'MM-DD'
                    },
                    value: {
                        tickCount: 5,

                        // min: 0,
                        formatter: (v) => `${util.formatNumberValue(v, true)} ${util.formatNumberUnit(v, true)}`
                    }
                });

                chart.axis('value', {
                    grid: null
                });
                chart.tooltip(false);

                chart.area()
                    .position('label*value')
                    .color(`l(90) 0:${color} 1:#ffffff`)
                    .shape('smooth');
                chart.line()
                    .position('label*value')
                    .color(`${color}`)
                    .shape('smooth');
                chart.render();

                return chart;
            };

            return initChart;
        }
    }
});

declare const d3, nv: any;

/**
 * ChartService to define the chart config for D3
 */
export class D3ChartService {

    static getChartConfig() {
        const today = new Date();
        const priorDate = new Date().setDate(today.getDate() - 30);
        return {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x(d) {
                    return d.x;
                },
                y(d) {
                    return d.y;
                },
                useInteractiveGuideline: true,
                dispatch: {},
                xAxis: {
                    axisLabel: 'Dates',
                    showMaxMin: false,
                    tickFormat(d) {
                        return d3.time.format('%b %d')(new Date(d));
                    }
                },
                xDomain: [priorDate, today],
                yAxis: {
                    axisLabel: '',
                    axisLabelDistance: 30
                },
                transitionDuration: 250
            },
            title: {
                enable: true
            }
        };
    }
}

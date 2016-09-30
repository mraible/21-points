(function() {
    'use strict';

    angular.module('21PointsApp')
        .factory('Chart', function Chart() {
            return {
                getBpChartConfig: function() {
                    return bpChartConfig;
                }
            }
        });

    var today = new Date();
    var priorDate = new Date().setDate(today.getDate()-30);

    var bpChartConfig = {
        chart: {
            type: "lineChart",
            height: 200,
            margin: {
                top: 20,
                right: 20,
                bottom: 40,
                left: 55
            },
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
            useInteractiveGuideline: true,
            dispatch: {},
            xAxis: {
                axisLabel: "Dates",
                showMaxMin: false,
                tickFormat: function(d){
                    return d3.time.format("%b %d")(new Date(d));
                }
            },
            xDomain: [priorDate, today],
            yAxis: {
                axisLabel: "",
                axisLabelDistance: 30
            },
            transitionDuration: 250
        },
        title: {
            enable: true
        }
    };
})();

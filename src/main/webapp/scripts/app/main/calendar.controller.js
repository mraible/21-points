'use strict';

angular.module('21pointsApp')
    .controller('CalendarController', function ($scope, $state, $compile, $log, uiCalendarConfig, Points, BloodPressure, Weight) {

        /* event source that calls a function on every view switch */
        $scope.eventSource = function getEvents(start, end, timezone, callback) {
            // start and end are for displayed calendar, so see if end is in current month before subtracting a month
            var date = end;
            var endOfMonth = moment(end).endOf('month');
            if (endOfMonth.diff(date, 'days') > 0) {
                date = end.subtract({months: 1});
            }
            date = date.format('YYYY-MM');
            $log.info("Fetching data for: " + date);
            $scope.events = [];
            Points.byMonth({month: date}, function (data) {
                data.points.forEach(function (item) {
                    $scope.events.push({
                        id: item.id,
                        title: item.exercise + item.meals + item.alcohol + ' Points',
                        tooltip: 'Exercise: ' + item.exercise + ', Meals: ' + item.meals + ', Alcohol: ' + item.alcohol,
                        type: 'points',
                        start: item.date,
                        allDay: true,
                        className: ['label label-primary']
                    })
                });

                BloodPressure.byMonth({month: date}, function (data) {
                    data.readings.forEach(function (item) {
                        $scope.events.push({
                            id: item.id,
                            title: item.systolic + '/' + item.diastolic,
                            type: 'bp',
                            start: item.timestamp,
                            allDay: false,
                            className: ['label label-info']
                        });
                    });

                    Weight.byMonth({month: date}, function (data) {
                        data.weighIns.forEach(function (item) {
                            $scope.events.push({
                                id: item.id,
                                title: "" + item.weight,
                                type: 'weight',
                                start: item.timestamp,
                                allDay: false,
                                className: ['label label-success']
                            })
                        });
                        callback($scope.events);
                    });
                });
            });

        };

        $scope.onEventClick = function (date, jsEvent, view) {
            $state.go('history.' + date.type, {id: date.id});
        };

        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };

        /* Change View */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };

        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            var tooltip = (event.tooltip) ? event.tooltip : event.title;
            element.attr({
                'tooltip': tooltip,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };

        /* config object */
        $scope.uiConfig = {
            calendar: {
                editable: false,
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.onEventClick,
                eventRender: $scope.eventRender
            }
        };

        $scope.eventSources = [$scope.eventSource];
    });

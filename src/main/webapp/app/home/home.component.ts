import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { PreferencesService } from '../entities/preferences/preferences.service';
import { Preferences } from '../entities/preferences/preferences.model';
import { PointsService } from '../entities/points/points.service';
import { BloodPressureService } from '../entities/blood-pressure/blood-pressure.service';
import { WeightService } from '../entities/weight/weight.service';
import { D3ChartService } from './d3-chart.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;
    preferences: Preferences;
    pointsThisWeek: any = {};
    pointsPercentage: number;
    bpReadings: any = {};
    bpOptions: any;
    bpData: any;
    weights: any = {};
    weightOptions: any;
    weightData: any;
    eventSubscriber: Subscription;

    constructor(private principal: Principal,
                private loginModalService: LoginModalService,
                private eventManager: JhiEventManager,
                private preferencesService: PreferencesService,
                private pointsService: PointsService,
                private bloodPressureService: BloodPressureService,
                private weightService: WeightService) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
            if (this.isAuthenticated()) {
                this.getUserData();
            }
        });
        this.registerAuthenticationSuccess();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
                this.getUserData();
            });
        });
        this.eventSubscriber = this.eventManager.subscribe('pointsListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('preferencesListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.getUserData());
        this.eventSubscriber = this.eventManager.subscribe('weightListModification', () => this.getUserData());
    }

    getUserData() {
        // Get preferences
        this.preferencesService.user().subscribe((preferences) => {
            this.preferences = preferences;

            // Get points for the current week
            this.pointsService.thisWeek().subscribe((points: any) => {
                points = points.json;
                this.pointsThisWeek = points;
                this.pointsPercentage = (points.points / this.preferences.weeklyGoal) * 100;

                // calculate success, warning, or danger
                if (points.points >= preferences.weeklyGoal) {
                    this.pointsThisWeek.progress = 'success';
                } else if (points.points < 10) {
                    this.pointsThisWeek.progress = 'danger';
                } else if (points.points > 10 && points.points < this.preferences.weeklyGoal) {
                    this.pointsThisWeek.progress = 'warning';
                }
            });
        });

        // Get blood pressure readings for the last 30 days
        this.bloodPressureService.last30Days().subscribe((bpReadings: any) => {
            this.bpReadings = bpReadings;
            // https://stackoverflow.com/a/34694155/65681
            this.bpOptions = {... D3ChartService.getChartConfig() };
            if (bpReadings.readings.length) {
                this.bpOptions.title.text = bpReadings.period;
                this.bpOptions.chart.yAxis.axisLabel = 'Blood Pressure';
                let systolics, diastolics, upperValues, lowerValues;
                systolics = [];
                diastolics = [];
                upperValues = [];
                lowerValues = [];
                bpReadings.readings.forEach((item) => {
                    systolics.push({
                        x: new Date(item.timestamp),
                        y: item.systolic
                    });
                    diastolics.push({
                        x: new Date(item.timestamp),
                        y: item.diastolic
                    });
                    upperValues.push(item.systolic);
                    lowerValues.push(item.diastolic);
                });
                this.bpData = [{
                    values: systolics,
                    key: 'Systolic',
                    color: '#673ab7'
                }, {
                    values: diastolics,
                    key: 'Diastolic',
                    color: '#03a9f4'
                }];
                // set y scale to be 10 more than max and min
                this.bpOptions.chart.yDomain = [Math.min.apply(Math, lowerValues) - 10, Math.max.apply(Math, upperValues) + 10];
            } else {
                this.bpReadings.readings = [];
            }
        });

        this.weightService.last30Days().subscribe((weights: any) => {
            this.weights = weights;
            if (weights.weighIns.length) {
                this.weightOptions = {... D3ChartService.getChartConfig() };
                this.weightOptions.title.text = this.weights.period;
                this.weightOptions.chart.yAxis.axisLabel = 'Weight';
                const weightValues = [];
                const values = [];
                weights.weighIns.forEach((item) => {
                    weightValues.push({
                        x: new Date(item.timestamp),
                        y: item.weight
                    });
                    values.push(item.weight);
                });
                this.weightData = [{
                    values: weightValues,
                    key: 'Weight',
                    color: '#ffeb3b',
                    area: true
                }];
                // set y scale to be 10 more than max and min
                this.weightOptions.chart.yDomain = [Math.min.apply(Math, values) - 10, Math.max.apply(Math, values) + 10];
            }
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}

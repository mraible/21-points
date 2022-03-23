import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Preferences } from '../entities/preferences/preferences.model';
import { PreferencesService } from '../entities/preferences/service/preferences.service';
import { PointsService } from '../entities/points/service/points.service';
import { BloodPressureService } from '../entities/blood-pressure/service/blood-pressure.service';
import { WeightService } from '../entities/weight/service/weight.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  preferences!: Preferences;
  pointsThisWeek: any = {};
  pointsPercentage!: number;
  bpReadings: any = {};
  bpOptions: any;
  bpData: any;
  weights: any = {};
  weightOptions: any;
  weightData: any;
  eventSubscriber!: Subscription;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    // private eventManager: JhiEventManager,
    private preferencesService: PreferencesService,
    private pointsService: PointsService,
    private bloodPressureService: BloodPressureService,
    private weightService: WeightService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    // this.registerAuthenticationSuccess();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // this.eventManager.destroy(this.eventSubscriber);
  }

  /* registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', () => {
      this.principal.identity().then(account => {
        this.account = account;
        this.getUserData();
      });
    });
    this.eventSubscriber = this.eventManager.subscribe('pointsListModification', () => this.getUserData());
    this.eventSubscriber = this.eventManager.subscribe('preferencesListModification', () => this.getUserData());
    this.eventSubscriber = this.eventManager.subscribe('bloodPressureListModification', () => this.getUserData());
    this.eventSubscriber = this.eventManager.subscribe('weightListModification', () => this.getUserData());
  }*/

  /* getUserData() {
    // Get preferences
    this.preferencesService.user().subscribe((preferences: any) => {
      this.preferences = preferences.body;

      // Get points for the current week
      this.pointsService.thisWeek().subscribe((points: any) => {
        points = points.body;
        this.pointsThisWeek = points;
        this.pointsPercentage = points.points / this.preferences.weeklyGoal * 100;

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
      bpReadings = bpReadings.body;
      this.bpReadings = bpReadings;
      // https://stackoverflow.com/a/34694155/65681
      this.bpOptions = { ...D3ChartService.getChartConfig() };
      if (bpReadings.readings.length) {
        this.bpOptions.title.text = bpReadings.period;
        this.bpOptions.chart.yAxis.axisLabel = 'Blood Pressure';
        let systolics, diastolics, upperValues, lowerValues;
        systolics = [];
        diastolics = [];
        upperValues = [];
        lowerValues = [];
        bpReadings.readings.forEach(item => {
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
        this.bpData = [
          {
            values: systolics,
            key: 'Systolic',
            color: '#673ab7'
          },
          {
            values: diastolics,
            key: 'Diastolic',
            color: '#03a9f4'
          }
        ];
        // set y scale to be 10 more than max and min
        this.bpOptions.chart.yDomain = [Math.min.apply(Math, lowerValues) - 10, Math.max.apply(Math, upperValues) + 10];
      } else {
        this.bpReadings.readings = [];
      }
    });

    this.weightService.last30Days().subscribe((weights: any) => {
      weights = weights.body;
      this.weights = weights;
      if (weights.weighIns.length) {
        this.weightOptions = { ...D3ChartService.getChartConfig() };
        this.weightOptions.title.text = this.weights.period;
        this.weightOptions.chart.yAxis.axisLabel = 'Weight';
        const weightValues = [];
        const values = [];
        weights.weighIns.forEach(item => {
          weightValues.push({
            x: new Date(item.timestamp),
            y: item.weight
          });
          values.push(item.weight);
        });
        this.weightData = [
          {
            values: weightValues,
            key: 'Weight',
            color: '#ffeb3b',
            area: true
          }
        ];
        // set y scale to be 10 more than max and min
        this.weightOptions.chart.yDomain = [Math.min.apply(Math, values) - 10, Math.max.apply(Math, values) + 10];
      }
    });
  }*/
}

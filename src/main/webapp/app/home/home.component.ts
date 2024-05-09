import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PointsService } from '../entities/points/service/points.service';
import { IPointsPerWeek } from '../entities/points/points.model';
import { PreferencesService } from '../entities/preferences/service/preferences.service';
import { IPreferences } from '../entities/preferences/preferences.model';
import { BloodPressureService } from '../entities/blood-pressure/service/blood-pressure.service';
import { IBloodPressure, IBloodPressureByPeriod } from '../entities/blood-pressure/blood-pressure.model';
import { WeightService } from '../entities/weight/service/weight.service';
import { IWeight, IWeightByPeriod } from '../entities/weight/weight.model';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, BaseChartDirective],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);
  pointsThisWeek: IPointsPerWeek = { points: 0 };
  pointsPercentage?: number;
  preferences!: IPreferences;
  bpReadings!: IBloodPressureByPeriod;
  bpOptions!: ChartOptions<'line'>;
  bpData!: ChartConfiguration<'line'>['data'];
  weights!: IWeightByPeriod;
  weightOptions!: ChartOptions<'line'>;
  weightData!: ChartConfiguration<'line'>['data'];

  private readonly destroy$ = new Subject<void>();

  private accountService = inject(AccountService);
  private router = inject(Router);
  private pointsService = inject(PointsService);
  private preferencesService = inject(PreferencesService);
  private bloodPressureService = inject(BloodPressureService);
  private weightService = inject(WeightService);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account.set(account);
        this.getUserData();
      });
  }

  getUserData(): void {
    // Get preferences
    this.preferencesService.user().subscribe((preferences: any) => {
      this.preferences = preferences.body;

      // Get points for the current week
      this.pointsService.thisWeek().subscribe((response: any) => {
        if (response.body) {
          this.pointsThisWeek = response.body;
          this.pointsPercentage = (this.pointsThisWeek.points / 21) * 100;

          // calculate success, warning, or danger
          if (this.pointsThisWeek.points >= preferences.weeklyGoal) {
            this.pointsThisWeek.progress = 'success';
          } else if (this.pointsThisWeek.points < 10) {
            this.pointsThisWeek.progress = 'danger';
          } else if (this.pointsThisWeek.points > 10 && this.pointsThisWeek.points < preferences.weeklyGoal) {
            this.pointsThisWeek.progress = 'warning';
          }
        }
      });
      // Get blood pressure readings for the last 30 days
      this.bloodPressureService.last30Days().subscribe((bpReadings: any) => {
        bpReadings = bpReadings.body;
        this.bpReadings = bpReadings;

        if (bpReadings.readings.length) {
          this.bpOptions = {
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: bpReadings.period,
              },
            },
            scales: {
              y: {
                beginAtZero: false,
              },
              x: {
                beginAtZero: false,
              },
            },
          };
          // this.bpOptions.chart.yAxis.axisLabel = 'Blood Pressure';
          const labels: any = [];
          const systolics: any = [];
          const diastolics: any = [];
          const upperValues: any = [];
          const lowerValues: any = [];
          bpReadings.readings.forEach((item: IBloodPressure) => {
            const timestamp = dayjs(item.timestamp).format('MMM DD');
            labels.push(timestamp);
            systolics.push({
              x: timestamp,
              y: item.systolic,
            });
            diastolics.push({
              x: timestamp,
              y: item.diastolic,
            });
            upperValues.push(item.systolic);
            lowerValues.push(item.diastolic);
          });
          const datasets = [
            {
              data: systolics,
              label: 'Systolic',
            },
            {
              data: diastolics,
              label: 'Diastolic',
            },
          ];
          this.bpData = {
            labels,
            datasets,
          };
          // set y scale to be 10 more than max and min
          this.bpOptions.scales = {
            y: {
              max: Math.max(...upperValues) + 10,
              min: Math.min(...lowerValues) - 10,
            },
          };
          // show both systolic and diastolic on hover
          this.bpOptions.interaction = {
            mode: 'index',
            intersect: false,
          };
        } else {
          this.bpReadings.readings = [];
        }
      });

      this.weightService.last30Days().subscribe((weights: any) => {
        weights = weights.body;
        this.weights = weights;
        if (weights.weighIns.length) {
          this.weightOptions = {
            responsive: true,
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: this.weights.period,
              },
            },
          };
          // this.weightOptions.chart.yAxis.axisLabel = 'Weight';
          const labels: any = [];
          const weightValues: any = [];
          const values: any = [];
          weights.weighIns.forEach((item: IWeight) => {
            const timestamp = dayjs(item.timestamp).format('MMM DD');
            labels.push(timestamp);
            weightValues.push({
              x: timestamp,
              y: item.weight,
            });
            values.push(item.weight);
          });
          const datasets = [
            {
              data: weightValues,
              label: 'Weight',
              fill: true,
              borderColor: '#ffeb3b',
              backgroundColor: 'rgba(255,235,59,0.3)',
            },
          ];
          this.weightData = {
            labels,
            datasets,
          };
          // set y scale to be 10 more than max and min
          this.weightOptions.scales = {
            y: {
              max: Math.max(...values) + 10,
              min: Math.min(...values) - 10,
            },
          };
        }
      });
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

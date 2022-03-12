import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBloodPressure } from '../blood-pressure.model';

@Component({
  selector: 'jhi-blood-pressure-detail',
  templateUrl: './blood-pressure-detail.component.html',
})
export class BloodPressureDetailComponent implements OnInit {
  bloodPressure: IBloodPressure | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bloodPressure }) => {
      this.bloodPressure = bloodPressure;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

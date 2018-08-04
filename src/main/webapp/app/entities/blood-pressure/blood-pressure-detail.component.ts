import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBloodPressure } from 'app/shared/model/blood-pressure.model';

@Component({
    selector: 'jhi-blood-pressure-detail',
    templateUrl: './blood-pressure-detail.component.html'
})
export class BloodPressureDetailComponent implements OnInit {
    bloodPressure: IBloodPressure;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bloodPressure }) => {
            this.bloodPressure = bloodPressure;
        });
    }

    previousState() {
        window.history.back();
    }
}

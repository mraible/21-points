import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeight } from 'app/shared/model/weight.model';

@Component({
    selector: 'jhi-weight-detail',
    templateUrl: './weight-detail.component.html'
})
export class WeightDetailComponent implements OnInit {
    weight: IWeight;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ weight }) => {
            this.weight = weight;
        });
    }

    previousState() {
        window.history.back();
    }
}

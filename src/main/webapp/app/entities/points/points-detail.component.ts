import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoints } from 'app/shared/model/points.model';

@Component({
    selector: 'jhi-points-detail',
    templateUrl: './points-detail.component.html'
})
export class PointsDetailComponent implements OnInit {
    points: IPoints;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ points }) => {
            this.points = points;
        });
    }

    previousState() {
        window.history.back();
    }
}

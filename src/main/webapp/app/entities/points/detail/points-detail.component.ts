import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPoints } from '../points.model';

@Component({
  selector: 'jhi-points-detail',
  templateUrl: './points-detail.component.html',
})
export class PointsDetailComponent implements OnInit {
  points: IPoints | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ points }) => {
      this.points = points;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

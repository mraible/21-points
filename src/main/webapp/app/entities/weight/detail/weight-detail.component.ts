import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeight } from '../weight.model';

@Component({
  selector: 'jhi-weight-detail',
  templateUrl: './weight-detail.component.html',
})
export class WeightDetailComponent implements OnInit {
  weight: IWeight | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ weight }) => {
      this.weight = weight;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

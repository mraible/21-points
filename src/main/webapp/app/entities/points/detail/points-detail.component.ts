import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IPoints } from '../points.model';

@Component({
  standalone: true,
  selector: 'jhi-points-detail',
  templateUrl: './points-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PointsDetailComponent {
  points = input<IPoints | null>(null);

  previousState(): void {
    window.history.back();
  }
}

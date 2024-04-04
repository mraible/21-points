import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IWeight } from '../weight.model';

@Component({
  standalone: true,
  selector: 'jhi-weight-detail',
  templateUrl: './weight-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class WeightDetailComponent {
  @Input() weight: IWeight | null = null;

  previousState(): void {
    window.history.back();
  }
}

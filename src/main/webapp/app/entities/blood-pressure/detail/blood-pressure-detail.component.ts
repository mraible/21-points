import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IBloodPressure } from '../blood-pressure.model';

@Component({
  standalone: true,
  selector: 'jhi-blood-pressure-detail',
  templateUrl: './blood-pressure-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class BloodPressureDetailComponent {
  @Input() bloodPressure: IBloodPressure | null = null;

  previousState(): void {
    window.history.back();
  }
}

import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IPreferences } from '../preferences.model';

@Component({
  standalone: true,
  selector: 'jhi-preferences-detail',
  templateUrl: './preferences-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PreferencesDetailComponent {
  @Input() preferences: IPreferences | null = null;

  previousState(): void {
    window.history.back();
  }
}

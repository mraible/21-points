import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPreferences } from '../preferences.model';
import { PreferencesService } from '../service/preferences.service';

@Component({
  standalone: true,
  templateUrl: './preferences-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PreferencesDeleteDialogComponent {
  preferences?: IPreferences;

  protected preferencesService = inject(PreferencesService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.preferencesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPreferences } from '../preferences.model';
import { PreferencesService } from '../service/preferences.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './preferences-delete-dialog.component.html',
})
export class PreferencesDeleteDialogComponent {
  preferences?: IPreferences;

  constructor(protected preferencesService: PreferencesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.preferencesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

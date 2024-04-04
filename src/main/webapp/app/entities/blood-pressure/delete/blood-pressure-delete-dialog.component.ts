import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';

@Component({
  standalone: true,
  templateUrl: './blood-pressure-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BloodPressureDeleteDialogComponent {
  bloodPressure?: IBloodPressure;

  protected bloodPressureService = inject(BloodPressureService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bloodPressureService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IWeight } from '../weight.model';
import { WeightService } from '../service/weight.service';

@Component({
  standalone: true,
  templateUrl: './weight-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class WeightDeleteDialogComponent {
  weight?: IWeight;

  protected weightService = inject(WeightService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.weightService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

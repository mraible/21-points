import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWeight } from '../weight.model';
import { WeightService } from '../service/weight.service';

@Component({
  templateUrl: './weight-delete-dialog.component.html',
})
export class WeightDeleteDialogComponent {
  weight?: IWeight;

  constructor(protected weightService: WeightService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.weightService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

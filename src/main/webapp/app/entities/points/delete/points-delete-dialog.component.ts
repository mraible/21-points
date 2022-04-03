import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPoints } from '../points.model';
import { PointsService } from '../service/points.service';

@Component({
  templateUrl: './points-delete-dialog.component.html',
})
export class PointsDeleteDialogComponent {
  points?: IPoints;

  constructor(protected pointsService: PointsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pointsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

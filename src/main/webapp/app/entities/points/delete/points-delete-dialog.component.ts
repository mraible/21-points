import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPoints } from '../points.model';
import { PointsService } from '../service/points.service';

@Component({
  standalone: true,
  templateUrl: './points-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PointsDeleteDialogComponent {
  points?: IPoints;

  protected pointsService = inject(PointsService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pointsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

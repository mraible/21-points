import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import ElasticsearchReindexModalComponent from './elasticsearch-reindex-modal.component';
import ElasticsearchReindexSelectedModalComponent from './elasticsearch-reindex-selected-modal.component';

@Component({
  standalone: true,
  selector: 'jhi-elasticsearch-reindex',
  imports: [SharedModule, FormsModule],
  templateUrl: './elasticsearch-reindex.component.html',
})
export default class ElasticsearchReindexComponent {
  entities: string[];
  reindexType: string;
  checks: { [key: string]: boolean } = {};

  constructor(private modalService: NgbModal) {
    this.reindexType = 'all';
    this.entities = ['Points', 'Weight', 'BloodPressure', 'Preferences', 'User'];
  }

  doReindex(): void {
    if (this.reindexType === 'all') {
      this.showConfirm();
    } else {
      this.showConfirmSelected();
    }
  }

  showConfirm(): void {
    this.modalService.open(ElasticsearchReindexModalComponent);
  }

  showConfirmSelected(): void {
    const activeModal = this.modalService.open(ElasticsearchReindexSelectedModalComponent);
    const checks = this.checks;
    activeModal.componentInstance.entities = this.entities.filter(function (name): any {
      return checks[name];
    });
  }
}

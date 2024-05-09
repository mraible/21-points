import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ElasticsearchReindexService } from './elasticsearch-reindex.service';

@Component({
  standalone: true,
  selector: 'jhi-elasticsearch-reindex-modal',
  templateUrl: './elasticsearch-reindex-modal.component.html',
})
export default class ElasticsearchReindexSelectedModalComponent {
  entities: string[];
  constructor(
    private elasticsearchReindexService: ElasticsearchReindexService,
    public activeModal: NgbActiveModal,
  ) {
    this.entities = [];
  }

  reindex(): void {
    this.elasticsearchReindexService.reindexSelected(this.entities).subscribe(() => this.activeModal.dismiss());
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ElasticsearchReindexService } from './elasticsearch-reindex.service';

@Component({
  standalone: true,
  selector: 'jhi-elasticsearch-reindex-modal',
  imports: [SharedModule, FormsModule],
  templateUrl: './elasticsearch-reindex-modal.component.html',
})
export default class ElasticsearchReindexModalComponent {
  constructor(
    private elasticsearchReindexService: ElasticsearchReindexService,
    public activeModal: NgbActiveModal,
  ) {}

  reindex(): void {
    this.elasticsearchReindexService.reindex().subscribe(() => this.activeModal.dismiss());
  }
}

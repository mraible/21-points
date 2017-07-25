import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { Weight } from './weight.model';
import { WeightPopupService } from './weight-popup.service';
import { WeightService } from './weight.service';

@Component({
    selector: 'jhi-weight-delete-dialog',
    templateUrl: './weight-delete-dialog.component.html'
})
export class WeightDeleteDialogComponent {

    weight: Weight;

    constructor(
        private weightService: WeightService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.weightService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'weightListModification',
                content: 'Deleted an weight'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('twentyOnePointsApp.weight.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-weight-delete-popup',
    template: ''
})
export class WeightDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private weightPopupService: WeightPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.weightPopupService
                .open(WeightDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

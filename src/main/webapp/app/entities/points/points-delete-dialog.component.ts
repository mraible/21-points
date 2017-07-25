import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { Points } from './points.model';
import { PointsPopupService } from './points-popup.service';
import { PointsService } from './points.service';

@Component({
    selector: 'jhi-points-delete-dialog',
    templateUrl: './points-delete-dialog.component.html'
})
export class PointsDeleteDialogComponent {

    points: Points;

    constructor(
        private pointsService: PointsService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pointsService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'pointsListModification',
                content: 'Deleted an points'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('twentyOnePointsApp.points.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-points-delete-popup',
    template: ''
})
export class PointsDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pointsPopupService: PointsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.pointsPopupService
                .open(PointsDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

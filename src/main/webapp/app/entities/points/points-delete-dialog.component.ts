import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPoints } from 'app/shared/model/points.model';
import { PointsService } from './points.service';

@Component({
    selector: 'jhi-points-delete-dialog',
    templateUrl: './points-delete-dialog.component.html'
})
export class PointsDeleteDialogComponent {
    points: IPoints;

    constructor(private pointsService: PointsService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pointsService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'pointsListModification',
                content: 'Deleted an points'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-points-delete-popup',
    template: ''
})
export class PointsDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ points }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PointsDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.points = points;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IBloodPressure } from 'app/shared/model/blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';

@Component({
    selector: 'jhi-blood-pressure-delete-dialog',
    templateUrl: './blood-pressure-delete-dialog.component.html'
})
export class BloodPressureDeleteDialogComponent {
    bloodPressure: IBloodPressure;

    constructor(
        private bloodPressureService: BloodPressureService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.bloodPressureService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'bloodPressureListModification',
                content: 'Deleted an bloodPressure'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-blood-pressure-delete-popup',
    template: ''
})
export class BloodPressureDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bloodPressure }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(BloodPressureDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.bloodPressure = bloodPressure;
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { BloodPressure } from './blood-pressure.model';
import { BloodPressurePopupService } from './blood-pressure-popup.service';
import { BloodPressureService } from './blood-pressure.service';

@Component({
    selector: 'jhi-blood-pressure-delete-dialog',
    templateUrl: './blood-pressure-delete-dialog.component.html'
})
export class BloodPressureDeleteDialogComponent {

    bloodPressure: BloodPressure;

    constructor(
        private bloodPressureService: BloodPressureService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.bloodPressureService.delete(id).subscribe((response) => {
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

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private bloodPressurePopupService: BloodPressurePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.bloodPressurePopupService
                .open(BloodPressureDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

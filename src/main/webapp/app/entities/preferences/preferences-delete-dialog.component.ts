import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { Preferences } from './preferences.model';
import { PreferencesPopupService } from './preferences-popup.service';
import { PreferencesService } from './preferences.service';

@Component({
    selector: 'jhi-preferences-delete-dialog',
    templateUrl: './preferences-delete-dialog.component.html'
})
export class PreferencesDeleteDialogComponent {

    preferences: Preferences;

    constructor(
        private preferencesService: PreferencesService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.preferencesService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'preferencesListModification',
                content: 'Deleted an preferences'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('twentyOnePointsApp.preferences.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-preferences-delete-popup',
    template: ''
})
export class PreferencesDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private preferencesPopupService: PreferencesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.preferencesPopupService
                .open(PreferencesDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

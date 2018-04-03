import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { BloodPressure } from './blood-pressure.model';
import { BloodPressurePopupService } from './blood-pressure-popup.service';
import { BloodPressureService } from './blood-pressure.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-blood-pressure-dialog',
    templateUrl: './blood-pressure-dialog.component.html'
})
export class BloodPressureDialogComponent implements OnInit {

    bloodPressure: BloodPressure;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private bloodPressureService: BloodPressureService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.bloodPressure.id !== undefined) {
            this.subscribeToSaveResponse(
                this.bloodPressureService.update(this.bloodPressure));
        } else {
            this.subscribeToSaveResponse(
                this.bloodPressureService.create(this.bloodPressure));
        }
    }

    private subscribeToSaveResponse(result: Observable<BloodPressure>) {
        result.subscribe((res: BloodPressure) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: BloodPressure) {
        this.eventManager.broadcast({ name: 'bloodPressureListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-blood-pressure-popup',
    template: ''
})
export class BloodPressurePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private bloodPressurePopupService: BloodPressurePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.bloodPressurePopupService
                    .open(BloodPressureDialogComponent as Component, params['id']);
            } else {
                this.bloodPressurePopupService
                    .open(BloodPressureDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

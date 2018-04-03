import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { BloodPressure } from './blood-pressure.model';
import { BloodPressurePopupService } from './blood-pressure-popup.service';
import { BloodPressureService } from './blood-pressure.service';
import { User, UserService } from '../../shared';

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
        private jhiAlertService: JhiAlertService,
        private bloodPressureService: BloodPressureService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
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

    private subscribeToSaveResponse(result: Observable<HttpResponse<BloodPressure>>) {
        result.subscribe((res: HttpResponse<BloodPressure>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: BloodPressure) {
        this.eventManager.broadcast({ name: 'bloodPressureListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
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

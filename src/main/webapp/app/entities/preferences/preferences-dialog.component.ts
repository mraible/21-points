import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { Preferences } from './preferences.model';
import { PreferencesPopupService } from './preferences-popup.service';
import { PreferencesService } from './preferences.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-preferences-dialog',
    templateUrl: './preferences-dialog.component.html'
})
export class PreferencesDialogComponent implements OnInit {

    preferences: Preferences;
    authorities: any[];
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private preferencesService: PreferencesService,
        private userService: UserService,
        private eventManager: EventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.preferences.id !== undefined) {
            this.subscribeToSaveResponse(
                this.preferencesService.update(this.preferences), false);
        } else {
            this.subscribeToSaveResponse(
                this.preferencesService.create(this.preferences), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Preferences>, isCreated: boolean) {
        result.subscribe((res: Preferences) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Preferences, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'twentyOnePointsApp.preferences.created'
            : 'twentyOnePointsApp.preferences.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'preferencesListModification', content: 'OK'});
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
    selector: 'jhi-preferences-popup',
    template: ''
})
export class PreferencesPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private preferencesPopupService: PreferencesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.preferencesPopupService
                    .open(PreferencesDialogComponent, params['id']);
            } else {
                this.modalRef = this.preferencesPopupService
                    .open(PreferencesDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Weight } from './weight.model';
import { WeightPopupService } from './weight-popup.service';
import { WeightService } from './weight.service';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-weight-dialog',
    templateUrl: './weight-dialog.component.html'
})
export class WeightDialogComponent implements OnInit {

    weight: Weight;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private weightService: WeightService,
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
        if (this.weight.id !== undefined) {
            this.subscribeToSaveResponse(
                this.weightService.update(this.weight));
        } else {
            this.subscribeToSaveResponse(
                this.weightService.create(this.weight));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Weight>>) {
        result.subscribe((res: HttpResponse<Weight>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Weight) {
        this.eventManager.broadcast({ name: 'weightListModification', content: 'OK'});
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
    selector: 'jhi-weight-popup',
    template: ''
})
export class WeightPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private weightPopupService: WeightPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.weightPopupService
                    .open(WeightDialogComponent as Component, params['id']);
            } else {
                this.weightPopupService
                    .open(WeightDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

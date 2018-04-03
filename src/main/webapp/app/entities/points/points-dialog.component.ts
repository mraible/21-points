import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Points } from './points.model';
import { PointsPopupService } from './points-popup.service';
import { PointsService } from './points.service';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-points-dialog',
    templateUrl: './points-dialog.component.html'
})
export class PointsDialogComponent implements OnInit {

    points: Points;
    isSaving: boolean;

    users: User[];
    dateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private pointsService: PointsService,
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
        if (this.points.id !== undefined) {
            this.subscribeToSaveResponse(
                this.pointsService.update(this.points));
        } else {
            this.subscribeToSaveResponse(
                this.pointsService.create(this.points));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Points>>) {
        result.subscribe((res: HttpResponse<Points>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Points) {
        this.eventManager.broadcast({ name: 'pointsListModification', content: 'OK'});
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
    selector: 'jhi-points-popup',
    template: ''
})
export class PointsPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private pointsPopupService: PointsPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.pointsPopupService
                    .open(PointsDialogComponent as Component, params['id']);
            } else {
                this.pointsPopupService
                    .open(PointsDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}

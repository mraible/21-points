import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IWeight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-weight-update',
    templateUrl: './weight-update.component.html'
})
export class WeightUpdateComponent implements OnInit {
    weight: IWeight;
    isSaving: boolean;

    users: IUser[];
    timestamp: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private weightService: WeightService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ weight }) => {
            this.weight = weight;
            this.timestamp = this.weight.timestamp != null ? this.weight.timestamp.format(DATE_TIME_FORMAT) : null;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.weight.timestamp = this.timestamp != null ? moment(this.timestamp, DATE_TIME_FORMAT) : null;
        if (this.weight.id !== undefined) {
            this.subscribeToSaveResponse(this.weightService.update(this.weight));
        } else {
            this.subscribeToSaveResponse(this.weightService.create(this.weight));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IWeight>>) {
        result.subscribe((res: HttpResponse<IWeight>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
}

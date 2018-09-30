import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPreferences } from 'app/shared/model/preferences.model';
import { Principal } from 'app/core';
import { PreferencesService } from './preferences.service';

@Component({
    selector: 'jhi-preferences',
    templateUrl: './preferences.component.html'
})
export class PreferencesComponent implements OnInit, OnDestroy {
    preferences: IPreferences[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    isAdmin: boolean;

    constructor(
        private preferencesService: PreferencesService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.preferencesService
                .search({
                    query: this.currentSearch
                })
                .subscribe(
                    (res: HttpResponse<IPreferences[]>) => (this.preferences = res.body),
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
        }
        this.preferencesService.query().subscribe(
            (res: HttpResponse<IPreferences[]>) => {
                this.preferences = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
            this.isAdmin = !account.authorities ? false : account.authorities.indexOf('ROLE_ADMIN') !== -1;
        });
        this.registerChangeInPreferences();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPreferences) {
        return item.id;
    }

    registerChangeInPreferences() {
        this.eventSubscriber = this.eventManager.subscribe('preferencesListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}

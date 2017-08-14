import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { Preferences } from './preferences.model';
import { PreferencesService } from './preferences.service';

@Component({
    selector: 'jhi-preferences-detail',
    templateUrl: './preferences-detail.component.html'
})
export class PreferencesDetailComponent implements OnInit, OnDestroy {

    preferences: Preferences;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private preferencesService: PreferencesService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPreferences();
    }

    load(id) {
        this.preferencesService.find(id).subscribe((preferences) => {
            this.preferences = preferences;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPreferences() {
        this.eventSubscriber = this.eventManager.subscribe(
            'preferencesListModification',
            (response) => this.load(this.preferences.id)
        );
    }
}

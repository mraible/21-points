import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPreferences } from 'app/shared/model/preferences.model';

@Component({
    selector: 'jhi-preferences-detail',
    templateUrl: './preferences-detail.component.html'
})
export class PreferencesDetailComponent implements OnInit {
    preferences: IPreferences;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ preferences }) => {
            this.preferences = preferences;
        });
    }

    previousState() {
        window.history.back();
    }
}

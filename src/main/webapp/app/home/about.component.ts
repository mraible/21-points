import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { PreferencesService } from '../entities/preferences/preferences.service';
import { Preferences } from '../entities/preferences/preferences.model';
import { PointsService } from '../entities/points/points.service';

@Component({
    selector: 'jhi-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    currentAccount: any;

    constructor(private principal: Principal) {}

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
    }
}

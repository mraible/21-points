import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager } from 'ng-jhipster';

import { Account, LoginModalService, Principal } from '../shared';
import { PreferencesService } from '../entities/preferences/preferences.service';
import { Preferences } from '../entities/preferences/preferences.model';
import { PointsService } from '../entities/points/points.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    preferences: Preferences;
    pointsThisWeek: any = {};
    pointsPercentage: number;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: EventManager,
        private preferencesService: PreferencesService,
        private pointsService: PointsService
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
            if (this.isAuthenticated()) {
                this.getUserData();
            }
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
        this.eventManager.subscribe('pointsListModification', (response) => {
            this.getUserData();
        });
    }

    getUserData() {
        // Get preferences
        this.preferencesService.user().subscribe((preferences) => {
            this.preferences = preferences;

            // Get points for the current week
            this.pointsService.thisWeek().subscribe((points: any) => {
                points = points.json;
                this.pointsThisWeek = points;
                this.pointsPercentage = (points.points / this.preferences.weeklyGoal) * 100;

                // calculate success, warning, or danger
                if (points.points >= preferences.weeklyGoal) {
                    this.pointsThisWeek.progress = 'success';
                } else if (points.points < 10) {
                    this.pointsThisWeek.progress = 'danger';
                } else if (points.points > 10 && points.points < this.preferences.weeklyGoal) {
                    this.pointsThisWeek.progress = 'warning';
                }
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}

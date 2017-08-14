import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { BloodPressure } from './blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';

@Component({
    selector: 'jhi-blood-pressure-detail',
    templateUrl: './blood-pressure-detail.component.html'
})
export class BloodPressureDetailComponent implements OnInit, OnDestroy {

    bloodPressure: BloodPressure;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private bloodPressureService: BloodPressureService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInBloodPressures();
    }

    load(id) {
        this.bloodPressureService.find(id).subscribe((bloodPressure) => {
            this.bloodPressure = bloodPressure;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInBloodPressures() {
        this.eventSubscriber = this.eventManager.subscribe(
            'bloodPressureListModification',
            (response) => this.load(this.bloodPressure.id)
        );
    }
}

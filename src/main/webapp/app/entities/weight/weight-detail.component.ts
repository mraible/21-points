import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Weight } from './weight.model';
import { WeightService } from './weight.service';

@Component({
    selector: 'jhi-weight-detail',
    templateUrl: './weight-detail.component.html'
})
export class WeightDetailComponent implements OnInit, OnDestroy {

    weight: Weight;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private weightService: WeightService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInWeights();
    }

    load(id) {
        this.weightService.find(id)
            .subscribe((weightResponse: HttpResponse<Weight>) => {
                this.weight = weightResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInWeights() {
        this.eventSubscriber = this.eventManager.subscribe(
            'weightListModification',
            (response) => this.load(this.weight.id)
        );
    }
}

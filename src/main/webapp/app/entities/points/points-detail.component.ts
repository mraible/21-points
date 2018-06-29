import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Points } from './points.model';
import { PointsService } from './points.service';

@Component({
    selector: 'jhi-points-detail',
    templateUrl: './points-detail.component.html'
})
export class PointsDetailComponent implements OnInit, OnDestroy {

    points: Points;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private pointsService: PointsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPoints();
    }

    load(id) {
        this.pointsService.find(id)
            .subscribe((pointsResponse: HttpResponse<Points>) => {
                this.points = pointsResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPoints() {
        this.eventSubscriber = this.eventManager.subscribe(
            'pointsListModification',
            (response) => this.load(this.points.id)
        );
    }
}

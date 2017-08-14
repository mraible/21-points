import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Points } from './points.model';
import { PointsService } from './points.service';

@Injectable()
export class PointsPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(private modalService: NgbModal,
                private router: Router,
                private pointsService: PointsService) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.pointsService.find(id).subscribe((points) => {
                    if (points.date) {
                        points.date = {
                            year: points.date.getFullYear(),
                            month: points.date.getMonth() + 1,
                            day: points.date.getDate()
                        };
                    }
                    this.ngbModalRef = this.pointsModalRef(component, points);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    // populate date with current date if new
                    const points = new Points();
                    const now = new Date();
                    points.date = {
                        year: now.getFullYear(),
                        month: now.getMonth() + 1,
                        day: now.getDate()
                    };
                    // default to the best day possible
                    points.exercise = 1;
                    points.meals = 1;
                    points.alcohol = 1;
                    this.ngbModalRef = this.pointsModalRef(component, points);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    pointsModalRef(component: Component, points: Points): NgbModalRef {
        const modalRef = this.modalService.open(component, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.points = points;
        modalRef.result.then((result) => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}

import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Points } from './points.model';
import { PointsService } from './points.service';

@Injectable()
export class PointsPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private pointsService: PointsService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.pointsService.find(id).subscribe((points) => {
                if (points.date) {
                    points.date = {
                        year: points.date.getFullYear(),
                        month: points.date.getMonth() + 1,
                        day: points.date.getDate()
                    };
                }
                this.pointsModalRef(component, points);
            });
        } else {
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
            return this.pointsModalRef(component, points);
        }
    }

    pointsModalRef(component: Component, points: Points): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.points = points;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
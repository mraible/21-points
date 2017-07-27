import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Weight } from './weight.model';
import { WeightService } from './weight.service';

@Injectable()
export class WeightPopupService {
    private isOpen = false;
    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private weightService: WeightService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.weightService.find(id).subscribe((weight) => {
                weight.timestamp = this.datePipe
                    .transform(weight.timestamp, 'yyyy-MM-ddThh:mm');
                this.weightModalRef(component, weight);
            });
        } else {
            // populate date/time with current time if new
            const weight = new Weight();
            weight.timestamp = this.datePipe
                .transform(new Date(), 'yyyy-MM-ddThh:mm');
            return this.weightModalRef(component, weight);
        }
    }

    weightModalRef(component: Component, weight: Weight): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.weight = weight;
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

import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BloodPressure } from './blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';

@Injectable()
export class BloodPressurePopupService {
    private isOpen = false;
    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private bloodPressureService: BloodPressureService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.bloodPressureService.find(id).subscribe((bloodPressure) => {
                bloodPressure.timestamp = this.datePipe
                    .transform(bloodPressure.timestamp, 'yyyy-MM-ddThh:mm');
                this.bloodPressureModalRef(component, bloodPressure);
            });
        } else {
            // populate date/time with current time if new
            const bp = new BloodPressure();
            bp.timestamp = this.datePipe
                .transform(new Date(), 'yyyy-MM-ddThh:mm');
            return this.bloodPressureModalRef(component, bp);
        }
    }

    bloodPressureModalRef(component: Component, bloodPressure: BloodPressure): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.bloodPressure = bloodPressure;
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

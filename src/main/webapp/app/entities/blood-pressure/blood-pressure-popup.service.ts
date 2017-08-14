import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BloodPressure } from './blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';

@Injectable()
export class BloodPressurePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(private datePipe: DatePipe,
                private modalService: NgbModal,
                private router: Router,
                private bloodPressureService: BloodPressureService) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.bloodPressureService.find(id).subscribe((bloodPressure) => {
                    bloodPressure.timestamp = this.datePipe
                        .transform(bloodPressure.timestamp, 'yyyy-MM-ddThh:mm');
                    this.ngbModalRef = this.bloodPressureModalRef(component, bloodPressure);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    // populate date/time with current time if new
                    const bp = new BloodPressure();
                    bp.timestamp = this.datePipe.transform(new Date(), 'yyyy-MM-ddThh:mm');
                    this.ngbModalRef = this.bloodPressureModalRef(component, bp);
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    bloodPressureModalRef(component: Component, bloodPressure: BloodPressure): NgbModalRef {
        const modalRef = this.modalService.open(component, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.bloodPressure = bloodPressure;
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

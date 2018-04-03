/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodPressureDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure-delete-dialog.component';
import { BloodPressureService } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure.service';

describe('Component Tests', () => {

    describe('BloodPressure Management Delete Component', () => {
        let comp: BloodPressureDeleteDialogComponent;
        let fixture: ComponentFixture<BloodPressureDeleteDialogComponent>;
        let service: BloodPressureService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [BloodPressureDeleteDialogComponent],
                providers: [
                    BloodPressureService
                ]
            })
            .overrideTemplate(BloodPressureDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BloodPressureDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BloodPressureService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});

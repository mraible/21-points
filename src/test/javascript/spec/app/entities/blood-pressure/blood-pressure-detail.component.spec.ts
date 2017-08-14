/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { TwentyOnePointsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { BloodPressureDetailComponent } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure-detail.component';
import { BloodPressureService } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure.service';
import { BloodPressure } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure.model';

describe('Component Tests', () => {

    describe('BloodPressure Management Detail Component', () => {
        let comp: BloodPressureDetailComponent;
        let fixture: ComponentFixture<BloodPressureDetailComponent>;
        let service: BloodPressureService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [BloodPressureDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    BloodPressureService,
                    JhiEventManager
                ]
            }).overrideTemplate(BloodPressureDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BloodPressureDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BloodPressureService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new BloodPressure(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.bloodPressure).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});

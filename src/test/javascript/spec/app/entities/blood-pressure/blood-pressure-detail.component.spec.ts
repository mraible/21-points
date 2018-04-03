/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TwentyOnePointsTestModule } from '../../../test.module';
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
                    BloodPressureService
                ]
            })
            .overrideTemplate(BloodPressureDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new BloodPressure(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.bloodPressure).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

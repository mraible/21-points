/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodPressureComponent } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure.component';
import { BloodPressureService } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure.service';
import { BloodPressure } from '../../../../../../main/webapp/app/entities/blood-pressure/blood-pressure.model';

describe('Component Tests', () => {

    describe('BloodPressure Management Component', () => {
        let comp: BloodPressureComponent;
        let fixture: ComponentFixture<BloodPressureComponent>;
        let service: BloodPressureService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [BloodPressureComponent],
                providers: [
                    BloodPressureService
                ]
            })
            .overrideTemplate(BloodPressureComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(BloodPressureComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BloodPressureService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new BloodPressure(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.bloodPressures[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

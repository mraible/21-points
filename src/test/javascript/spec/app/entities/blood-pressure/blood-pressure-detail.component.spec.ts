/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodPressureDetailComponent } from 'app/entities/blood-pressure/blood-pressure-detail.component';
import { BloodPressure } from 'app/shared/model/blood-pressure.model';

describe('Component Tests', () => {
    describe('BloodPressure Management Detail Component', () => {
        let comp: BloodPressureDetailComponent;
        let fixture: ComponentFixture<BloodPressureDetailComponent>;
        const route = ({ data: of({ bloodPressure: new BloodPressure(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [BloodPressureDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BloodPressureDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BloodPressureDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.bloodPressure).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});

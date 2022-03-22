/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { BloodPressureUpdateComponent } from 'app/entities/blood-pressure/blood-pressure-update.component';
import { BloodPressureService } from 'app/entities/blood-pressure/blood-pressure.service';
import { BloodPressure } from 'app/shared/model/blood-pressure.model';

describe('Component Tests', () => {
    describe('BloodPressure Management Update Component', () => {
        let comp: BloodPressureUpdateComponent;
        let fixture: ComponentFixture<BloodPressureUpdateComponent>;
        let service: BloodPressureService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [BloodPressureUpdateComponent]
            })
                .overrideTemplate(BloodPressureUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BloodPressureUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BloodPressureService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new BloodPressure(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.bloodPressure = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new BloodPressure();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.bloodPressure = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});

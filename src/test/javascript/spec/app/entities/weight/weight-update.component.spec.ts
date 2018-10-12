/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { WeightUpdateComponent } from 'app/entities/weight/weight-update.component';
import { WeightService } from 'app/entities/weight/weight.service';
import { Weight } from 'app/shared/model/weight.model';

describe('Component Tests', () => {
    describe('Weight Management Update Component', () => {
        let comp: WeightUpdateComponent;
        let fixture: ComponentFixture<WeightUpdateComponent>;
        let service: WeightService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [WeightUpdateComponent]
            })
                .overrideTemplate(WeightUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(WeightUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeightService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Weight(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.weight = entity;
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
                    const entity = new Weight();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.weight = entity;
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

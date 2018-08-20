/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PointsUpdateComponent } from 'app/entities/points/points-update.component';
import { PointsService } from 'app/entities/points/points.service';
import { Points } from 'app/shared/model/points.model';

describe('Component Tests', () => {
    describe('Points Management Update Component', () => {
        let comp: PointsUpdateComponent;
        let fixture: ComponentFixture<PointsUpdateComponent>;
        let service: PointsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PointsUpdateComponent]
            })
                .overrideTemplate(PointsUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PointsUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointsService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Points(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.points = entity;
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
                    const entity = new Points();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.points = entity;
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

/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PreferencesUpdateComponent } from 'app/entities/preferences/preferences-update.component';
import { PreferencesService } from 'app/entities/preferences/preferences.service';
import { Preferences } from 'app/shared/model/preferences.model';

describe('Component Tests', () => {
    describe('Preferences Management Update Component', () => {
        let comp: PreferencesUpdateComponent;
        let fixture: ComponentFixture<PreferencesUpdateComponent>;
        let service: PreferencesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PreferencesUpdateComponent]
            })
                .overrideTemplate(PreferencesUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PreferencesUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PreferencesService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Preferences(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.preferences = entity;
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
                    const entity = new Preferences();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.preferences = entity;
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

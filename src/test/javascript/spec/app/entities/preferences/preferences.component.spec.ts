/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PreferencesComponent } from 'app/entities/preferences/preferences.component';
import { PreferencesService } from 'app/entities/preferences/preferences.service';
import { Preferences } from 'app/shared/model/preferences.model';

describe('Component Tests', () => {
    describe('Preferences Management Component', () => {
        let comp: PreferencesComponent;
        let fixture: ComponentFixture<PreferencesComponent>;
        let service: PreferencesService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PreferencesComponent],
                providers: []
            })
                .overrideTemplate(PreferencesComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PreferencesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PreferencesService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Preferences(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.preferences[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});

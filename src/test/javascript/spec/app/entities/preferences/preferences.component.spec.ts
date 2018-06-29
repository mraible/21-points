/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PreferencesComponent } from '../../../../../../main/webapp/app/entities/preferences/preferences.component';
import { PreferencesService } from '../../../../../../main/webapp/app/entities/preferences/preferences.service';
import { Preferences } from '../../../../../../main/webapp/app/entities/preferences/preferences.model';

describe('Component Tests', () => {

    describe('Preferences Management Component', () => {
        let comp: PreferencesComponent;
        let fixture: ComponentFixture<PreferencesComponent>;
        let service: PreferencesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PreferencesComponent],
                providers: [
                    PreferencesService
                ]
            })
            .overrideTemplate(PreferencesComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PreferencesComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PreferencesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Preferences(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.preferences[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

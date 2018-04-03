/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { TwentyOnePointsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { PreferencesDetailComponent } from '../../../../../../main/webapp/app/entities/preferences/preferences-detail.component';
import { PreferencesService } from '../../../../../../main/webapp/app/entities/preferences/preferences.service';
import { Preferences } from '../../../../../../main/webapp/app/entities/preferences/preferences.model';

describe('Component Tests', () => {

    describe('Preferences Management Detail Component', () => {
        let comp: PreferencesDetailComponent;
        let fixture: ComponentFixture<PreferencesDetailComponent>;
        let service: PreferencesService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PreferencesDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    PreferencesService,
                    JhiEventManager
                ]
            }).overrideTemplate(PreferencesDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PreferencesDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PreferencesService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Preferences(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.preferences).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});

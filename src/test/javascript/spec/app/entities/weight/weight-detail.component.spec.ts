/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { TwentyOnePointsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { WeightDetailComponent } from '../../../../../../main/webapp/app/entities/weight/weight-detail.component';
import { WeightService } from '../../../../../../main/webapp/app/entities/weight/weight.service';
import { Weight } from '../../../../../../main/webapp/app/entities/weight/weight.model';

describe('Component Tests', () => {

    describe('Weight Management Detail Component', () => {
        let comp: WeightDetailComponent;
        let fixture: ComponentFixture<WeightDetailComponent>;
        let service: WeightService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [WeightDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    WeightService,
                    JhiEventManager
                ]
            }).overrideTemplate(WeightDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WeightDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeightService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Weight(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.weight).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});

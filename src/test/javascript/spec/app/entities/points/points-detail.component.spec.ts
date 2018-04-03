/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { TwentyOnePointsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { PointsDetailComponent } from '../../../../../../main/webapp/app/entities/points/points-detail.component';
import { PointsService } from '../../../../../../main/webapp/app/entities/points/points.service';
import { Points } from '../../../../../../main/webapp/app/entities/points/points.model';

describe('Component Tests', () => {

    describe('Points Management Detail Component', () => {
        let comp: PointsDetailComponent;
        let fixture: ComponentFixture<PointsDetailComponent>;
        let service: PointsService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PointsDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    PointsService,
                    JhiEventManager
                ]
            }).overrideTemplate(PointsDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PointsDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointsService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Points(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.points).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});

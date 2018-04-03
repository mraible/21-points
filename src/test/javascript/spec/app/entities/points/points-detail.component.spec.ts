/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TwentyOnePointsTestModule } from '../../../test.module';
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
                    PointsService
                ]
            })
            .overrideTemplate(PointsDetailComponent, '')
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

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Points(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.points).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

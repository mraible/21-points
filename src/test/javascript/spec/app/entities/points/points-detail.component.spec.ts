/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { PointsDetailComponent } from 'app/entities/points/points-detail.component';
import { Points } from 'app/shared/model/points.model';

describe('Component Tests', () => {
    describe('Points Management Detail Component', () => {
        let comp: PointsDetailComponent;
        let fixture: ComponentFixture<PointsDetailComponent>;
        const route = ({ data: of({ points: new Points(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [PointsDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PointsDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PointsDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.points).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});

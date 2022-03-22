/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { WeightDetailComponent } from 'app/entities/weight/weight-detail.component';
import { Weight } from 'app/shared/model/weight.model';

describe('Component Tests', () => {
    describe('Weight Management Detail Component', () => {
        let comp: WeightDetailComponent;
        let fixture: ComponentFixture<WeightDetailComponent>;
        const route = ({ data: of({ weight: new Weight(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [WeightDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(WeightDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(WeightDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.weight).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});

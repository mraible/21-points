/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TwentyOnePointsTestModule } from '../../../test.module';
import { WeightComponent } from '../../../../../../main/webapp/app/entities/weight/weight.component';
import { WeightService } from '../../../../../../main/webapp/app/entities/weight/weight.service';
import { Weight } from '../../../../../../main/webapp/app/entities/weight/weight.model';

describe('Component Tests', () => {

    describe('Weight Management Component', () => {
        let comp: WeightComponent;
        let fixture: ComponentFixture<WeightComponent>;
        let service: WeightService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [TwentyOnePointsTestModule],
                declarations: [WeightComponent],
                providers: [
                    WeightService
                ]
            })
            .overrideTemplate(WeightComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(WeightComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(WeightService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Weight(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.weights[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});

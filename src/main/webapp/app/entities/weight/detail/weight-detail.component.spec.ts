import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WeightDetailComponent } from './weight-detail.component';

describe('Weight Management Detail Component', () => {
  let comp: WeightDetailComponent;
  let fixture: ComponentFixture<WeightDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ weight: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WeightDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WeightDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load weight on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.weight).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

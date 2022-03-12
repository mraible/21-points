import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PointsDetailComponent } from './points-detail.component';

describe('Points Management Detail Component', () => {
  let comp: PointsDetailComponent;
  let fixture: ComponentFixture<PointsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PointsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ points: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PointsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PointsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load points on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.points).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

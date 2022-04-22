import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PreferencesDetailComponent } from './preferences-detail.component';

describe('Preferences Management Detail Component', () => {
  let comp: PreferencesDetailComponent;
  let fixture: ComponentFixture<PreferencesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreferencesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ preferences: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PreferencesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PreferencesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load preferences on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.preferences).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

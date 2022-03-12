import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PreferencesService } from '../service/preferences.service';

import { PreferencesComponent } from './preferences.component';

describe('Preferences Management Component', () => {
  let comp: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let service: PreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'preferences', component: PreferencesComponent }]), HttpClientTestingModule],
      declarations: [PreferencesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {} } },
        },
      ],
    })
      .overrideTemplate(PreferencesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PreferencesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PreferencesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.preferences?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

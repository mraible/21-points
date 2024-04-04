import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PreferencesFormService } from './preferences-form.service';
import { PreferencesService } from '../service/preferences.service';
import { IPreferences } from '../preferences.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { PreferencesUpdateComponent } from './preferences-update.component';

describe('Preferences Management Update Component', () => {
  let comp: PreferencesUpdateComponent;
  let fixture: ComponentFixture<PreferencesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let preferencesFormService: PreferencesFormService;
  let preferencesService: PreferencesService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PreferencesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PreferencesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PreferencesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    preferencesFormService = TestBed.inject(PreferencesFormService);
    preferencesService = TestBed.inject(PreferencesService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const preferences: IPreferences = { id: 456 };
      const user: IUser = { id: 76797 };
      preferences.user = user;

      const userCollection: IUser[] = [{ id: 99188 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ preferences });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const preferences: IPreferences = { id: 456 };
      const user: IUser = { id: 79175 };
      preferences.user = user;

      activatedRoute.data = of({ preferences });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.preferences).toEqual(preferences);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreferences>>();
      const preferences = { id: 123 };
      jest.spyOn(preferencesFormService, 'getPreferences').mockReturnValue(preferences);
      jest.spyOn(preferencesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preferences });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: preferences }));
      saveSubject.complete();

      // THEN
      expect(preferencesFormService.getPreferences).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(preferencesService.update).toHaveBeenCalledWith(expect.objectContaining(preferences));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreferences>>();
      const preferences = { id: 123 };
      jest.spyOn(preferencesFormService, 'getPreferences').mockReturnValue({ id: null });
      jest.spyOn(preferencesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preferences: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: preferences }));
      saveSubject.complete();

      // THEN
      expect(preferencesFormService.getPreferences).toHaveBeenCalled();
      expect(preferencesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreferences>>();
      const preferences = { id: 123 };
      jest.spyOn(preferencesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preferences });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(preferencesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

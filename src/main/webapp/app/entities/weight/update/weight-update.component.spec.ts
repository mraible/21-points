import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WeightFormService } from './weight-form.service';
import { WeightService } from '../service/weight.service';
import { IWeight } from '../weight.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { WeightUpdateComponent } from './weight-update.component';

describe('Weight Management Update Component', () => {
  let comp: WeightUpdateComponent;
  let fixture: ComponentFixture<WeightUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let weightFormService: WeightFormService;
  let weightService: WeightService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WeightUpdateComponent],
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
      .overrideTemplate(WeightUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WeightUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    weightFormService = TestBed.inject(WeightFormService);
    weightService = TestBed.inject(WeightService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const weight: IWeight = { id: 456 };
      const user: IUser = { id: 19261 };
      weight.user = user;

      const userCollection: IUser[] = [{ id: 48569 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ weight });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const weight: IWeight = { id: 456 };
      const user: IUser = { id: 30575 };
      weight.user = user;

      activatedRoute.data = of({ weight });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.weight).toEqual(weight);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeight>>();
      const weight = { id: 123 };
      jest.spyOn(weightFormService, 'getWeight').mockReturnValue(weight);
      jest.spyOn(weightService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ weight });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: weight }));
      saveSubject.complete();

      // THEN
      expect(weightFormService.getWeight).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(weightService.update).toHaveBeenCalledWith(expect.objectContaining(weight));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeight>>();
      const weight = { id: 123 };
      jest.spyOn(weightFormService, 'getWeight').mockReturnValue({ id: null });
      jest.spyOn(weightService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ weight: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: weight }));
      saveSubject.complete();

      // THEN
      expect(weightFormService.getWeight).toHaveBeenCalled();
      expect(weightService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeight>>();
      const weight = { id: 123 };
      jest.spyOn(weightService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ weight });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(weightService.update).toHaveBeenCalled();
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

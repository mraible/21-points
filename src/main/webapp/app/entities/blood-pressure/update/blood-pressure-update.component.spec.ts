import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BloodPressureService } from '../service/blood-pressure.service';
import { IBloodPressure, BloodPressure } from '../blood-pressure.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { BloodPressureUpdateComponent } from './blood-pressure-update.component';

describe('BloodPressure Management Update Component', () => {
  let comp: BloodPressureUpdateComponent;
  let fixture: ComponentFixture<BloodPressureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bloodPressureService: BloodPressureService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BloodPressureUpdateComponent],
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
      .overrideTemplate(BloodPressureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BloodPressureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bloodPressureService = TestBed.inject(BloodPressureService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const bloodPressure: IBloodPressure = { id: 456 };
      const user: IUser = { id: 3909 };
      bloodPressure.user = user;

      const userCollection: IUser[] = [{ id: 46631 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bloodPressure });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bloodPressure: IBloodPressure = { id: 456 };
      const user: IUser = { id: 72703 };
      bloodPressure.user = user;

      activatedRoute.data = of({ bloodPressure });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bloodPressure));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BloodPressure>>();
      const bloodPressure = { id: 123 };
      jest.spyOn(bloodPressureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloodPressure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bloodPressure }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bloodPressureService.update).toHaveBeenCalledWith(bloodPressure);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BloodPressure>>();
      const bloodPressure = new BloodPressure();
      jest.spyOn(bloodPressureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloodPressure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bloodPressure }));
      saveSubject.complete();

      // THEN
      expect(bloodPressureService.create).toHaveBeenCalledWith(bloodPressure);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BloodPressure>>();
      const bloodPressure = { id: 123 };
      jest.spyOn(bloodPressureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bloodPressure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bloodPressureService.update).toHaveBeenCalledWith(bloodPressure);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});

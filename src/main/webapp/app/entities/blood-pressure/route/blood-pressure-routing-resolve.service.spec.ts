import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IBloodPressure, BloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';

import { BloodPressureRoutingResolveService } from './blood-pressure-routing-resolve.service';

describe('BloodPressure routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: BloodPressureRoutingResolveService;
  let service: BloodPressureService;
  let resultBloodPressure: IBloodPressure | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(BloodPressureRoutingResolveService);
    service = TestBed.inject(BloodPressureService);
    resultBloodPressure = undefined;
  });

  describe('resolve', () => {
    it('should return IBloodPressure returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBloodPressure = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBloodPressure).toEqual({ id: 123 });
    });

    it('should return new IBloodPressure if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBloodPressure = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultBloodPressure).toEqual(new BloodPressure());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as BloodPressure })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultBloodPressure = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultBloodPressure).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});

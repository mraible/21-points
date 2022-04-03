import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPoints, Points } from '../points.model';

import { PointsService } from './points.service';

describe('Points Service', () => {
  let service: PointsService;
  let httpMock: HttpTestingController;
  let elemDefault: IPoints;
  let expectedResult: IPoints | IPoints[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PointsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      exercise: 0,
      meals: 0,
      alcohol: 0,
      notes: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Points', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Points()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Points', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          exercise: 1,
          meals: 1,
          alcohol: 1,
          notes: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Points', () => {
      const patchObject = Object.assign(
        {
          exercise: 1,
          notes: 'BBBBBB',
        },
        new Points()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Points', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          exercise: 1,
          meals: 1,
          alcohol: 1,
          notes: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Points', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPointsToCollectionIfMissing', () => {
      it('should add a Points to an empty array', () => {
        const points: IPoints = { id: 123 };
        expectedResult = service.addPointsToCollectionIfMissing([], points);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(points);
      });

      it('should not add a Points to an array that contains it', () => {
        const points: IPoints = { id: 123 };
        const pointsCollection: IPoints[] = [
          {
            ...points,
          },
          { id: 456 },
        ];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, points);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Points to an array that doesn't contain it", () => {
        const points: IPoints = { id: 123 };
        const pointsCollection: IPoints[] = [{ id: 456 }];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, points);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(points);
      });

      it('should add only unique Points to an array', () => {
        const pointsArray: IPoints[] = [{ id: 123 }, { id: 456 }, { id: 75604 }];
        const pointsCollection: IPoints[] = [{ id: 123 }];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, ...pointsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const points: IPoints = { id: 123 };
        const points2: IPoints = { id: 456 };
        expectedResult = service.addPointsToCollectionIfMissing([], points, points2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(points);
        expect(expectedResult).toContain(points2);
      });

      it('should accept null and undefined values', () => {
        const points: IPoints = { id: 123 };
        expectedResult = service.addPointsToCollectionIfMissing([], null, points, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(points);
      });

      it('should return initial array if no Points is added', () => {
        const pointsCollection: IPoints[] = [{ id: 123 }];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, undefined, null);
        expect(expectedResult).toEqual(pointsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

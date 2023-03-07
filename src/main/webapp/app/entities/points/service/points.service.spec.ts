import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPoints } from '../points.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../points.test-samples';

import { PointsService, RestPoints } from './points.service';

const requireRestSample: RestPoints = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Points Service', () => {
  let service: PointsService;
  let httpMock: HttpTestingController;
  let expectedResult: IPoints | IPoints[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PointsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Points', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const points = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(points).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Points', () => {
      const points = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(points).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Points', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Points', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Points', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPointsToCollectionIfMissing', () => {
      it('should add a Points to an empty array', () => {
        const points: IPoints = sampleWithRequiredData;
        expectedResult = service.addPointsToCollectionIfMissing([], points);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(points);
      });

      it('should not add a Points to an array that contains it', () => {
        const points: IPoints = sampleWithRequiredData;
        const pointsCollection: IPoints[] = [
          {
            ...points,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, points);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Points to an array that doesn't contain it", () => {
        const points: IPoints = sampleWithRequiredData;
        const pointsCollection: IPoints[] = [sampleWithPartialData];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, points);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(points);
      });

      it('should add only unique Points to an array', () => {
        const pointsArray: IPoints[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pointsCollection: IPoints[] = [sampleWithRequiredData];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, ...pointsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const points: IPoints = sampleWithRequiredData;
        const points2: IPoints = sampleWithPartialData;
        expectedResult = service.addPointsToCollectionIfMissing([], points, points2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(points);
        expect(expectedResult).toContain(points2);
      });

      it('should accept null and undefined values', () => {
        const points: IPoints = sampleWithRequiredData;
        expectedResult = service.addPointsToCollectionIfMissing([], null, points, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(points);
      });

      it('should return initial array if no Points is added', () => {
        const pointsCollection: IPoints[] = [sampleWithRequiredData];
        expectedResult = service.addPointsToCollectionIfMissing(pointsCollection, undefined, null);
        expect(expectedResult).toEqual(pointsCollection);
      });
    });

    describe('comparePoints', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePoints(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePoints(entity1, entity2);
        const compareResult2 = service.comparePoints(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePoints(entity1, entity2);
        const compareResult2 = service.comparePoints(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePoints(entity1, entity2);
        const compareResult2 = service.comparePoints(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

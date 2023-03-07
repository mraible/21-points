import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWeight } from '../weight.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../weight.test-samples';

import { WeightService, RestWeight } from './weight.service';

const requireRestSample: RestWeight = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('Weight Service', () => {
  let service: WeightService;
  let httpMock: HttpTestingController;
  let expectedResult: IWeight | IWeight[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WeightService);
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

    it('should create a Weight', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const weight = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(weight).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Weight', () => {
      const weight = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(weight).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Weight', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Weight', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Weight', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWeightToCollectionIfMissing', () => {
      it('should add a Weight to an empty array', () => {
        const weight: IWeight = sampleWithRequiredData;
        expectedResult = service.addWeightToCollectionIfMissing([], weight);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(weight);
      });

      it('should not add a Weight to an array that contains it', () => {
        const weight: IWeight = sampleWithRequiredData;
        const weightCollection: IWeight[] = [
          {
            ...weight,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWeightToCollectionIfMissing(weightCollection, weight);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Weight to an array that doesn't contain it", () => {
        const weight: IWeight = sampleWithRequiredData;
        const weightCollection: IWeight[] = [sampleWithPartialData];
        expectedResult = service.addWeightToCollectionIfMissing(weightCollection, weight);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(weight);
      });

      it('should add only unique Weight to an array', () => {
        const weightArray: IWeight[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const weightCollection: IWeight[] = [sampleWithRequiredData];
        expectedResult = service.addWeightToCollectionIfMissing(weightCollection, ...weightArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const weight: IWeight = sampleWithRequiredData;
        const weight2: IWeight = sampleWithPartialData;
        expectedResult = service.addWeightToCollectionIfMissing([], weight, weight2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(weight);
        expect(expectedResult).toContain(weight2);
      });

      it('should accept null and undefined values', () => {
        const weight: IWeight = sampleWithRequiredData;
        expectedResult = service.addWeightToCollectionIfMissing([], null, weight, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(weight);
      });

      it('should return initial array if no Weight is added', () => {
        const weightCollection: IWeight[] = [sampleWithRequiredData];
        expectedResult = service.addWeightToCollectionIfMissing(weightCollection, undefined, null);
        expect(expectedResult).toEqual(weightCollection);
      });
    });

    describe('compareWeight', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWeight(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWeight(entity1, entity2);
        const compareResult2 = service.compareWeight(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWeight(entity1, entity2);
        const compareResult2 = service.compareWeight(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWeight(entity1, entity2);
        const compareResult2 = service.compareWeight(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

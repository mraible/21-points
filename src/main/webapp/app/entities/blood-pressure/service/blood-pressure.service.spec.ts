import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBloodPressure } from '../blood-pressure.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../blood-pressure.test-samples';

import { BloodPressureService, RestBloodPressure } from './blood-pressure.service';

const requireRestSample: RestBloodPressure = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('BloodPressure Service', () => {
  let service: BloodPressureService;
  let httpMock: HttpTestingController;
  let expectedResult: IBloodPressure | IBloodPressure[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BloodPressureService);
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

    it('should create a BloodPressure', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const bloodPressure = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bloodPressure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BloodPressure', () => {
      const bloodPressure = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bloodPressure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BloodPressure', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BloodPressure', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BloodPressure', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBloodPressureToCollectionIfMissing', () => {
      it('should add a BloodPressure to an empty array', () => {
        const bloodPressure: IBloodPressure = sampleWithRequiredData;
        expectedResult = service.addBloodPressureToCollectionIfMissing([], bloodPressure);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloodPressure);
      });

      it('should not add a BloodPressure to an array that contains it', () => {
        const bloodPressure: IBloodPressure = sampleWithRequiredData;
        const bloodPressureCollection: IBloodPressure[] = [
          {
            ...bloodPressure,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBloodPressureToCollectionIfMissing(bloodPressureCollection, bloodPressure);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BloodPressure to an array that doesn't contain it", () => {
        const bloodPressure: IBloodPressure = sampleWithRequiredData;
        const bloodPressureCollection: IBloodPressure[] = [sampleWithPartialData];
        expectedResult = service.addBloodPressureToCollectionIfMissing(bloodPressureCollection, bloodPressure);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloodPressure);
      });

      it('should add only unique BloodPressure to an array', () => {
        const bloodPressureArray: IBloodPressure[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bloodPressureCollection: IBloodPressure[] = [sampleWithRequiredData];
        expectedResult = service.addBloodPressureToCollectionIfMissing(bloodPressureCollection, ...bloodPressureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bloodPressure: IBloodPressure = sampleWithRequiredData;
        const bloodPressure2: IBloodPressure = sampleWithPartialData;
        expectedResult = service.addBloodPressureToCollectionIfMissing([], bloodPressure, bloodPressure2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bloodPressure);
        expect(expectedResult).toContain(bloodPressure2);
      });

      it('should accept null and undefined values', () => {
        const bloodPressure: IBloodPressure = sampleWithRequiredData;
        expectedResult = service.addBloodPressureToCollectionIfMissing([], null, bloodPressure, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bloodPressure);
      });

      it('should return initial array if no BloodPressure is added', () => {
        const bloodPressureCollection: IBloodPressure[] = [sampleWithRequiredData];
        expectedResult = service.addBloodPressureToCollectionIfMissing(bloodPressureCollection, undefined, null);
        expect(expectedResult).toEqual(bloodPressureCollection);
      });
    });

    describe('compareBloodPressure', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBloodPressure(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBloodPressure(entity1, entity2);
        const compareResult2 = service.compareBloodPressure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBloodPressure(entity1, entity2);
        const compareResult2 = service.compareBloodPressure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBloodPressure(entity1, entity2);
        const compareResult2 = service.compareBloodPressure(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

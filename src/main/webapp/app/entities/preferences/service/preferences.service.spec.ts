import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPreferences } from '../preferences.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../preferences.test-samples';

import { PreferencesService } from './preferences.service';

const requireRestSample: IPreferences = {
  ...sampleWithRequiredData,
};

describe('Preferences Service', () => {
  let service: PreferencesService;
  let httpMock: HttpTestingController;
  let expectedResult: IPreferences | IPreferences[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PreferencesService);
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

    it('should create a Preferences', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const preferences = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(preferences).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Preferences', () => {
      const preferences = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(preferences).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Preferences', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Preferences', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Preferences', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPreferencesToCollectionIfMissing', () => {
      it('should add a Preferences to an empty array', () => {
        const preferences: IPreferences = sampleWithRequiredData;
        expectedResult = service.addPreferencesToCollectionIfMissing([], preferences);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(preferences);
      });

      it('should not add a Preferences to an array that contains it', () => {
        const preferences: IPreferences = sampleWithRequiredData;
        const preferencesCollection: IPreferences[] = [
          {
            ...preferences,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPreferencesToCollectionIfMissing(preferencesCollection, preferences);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Preferences to an array that doesn't contain it", () => {
        const preferences: IPreferences = sampleWithRequiredData;
        const preferencesCollection: IPreferences[] = [sampleWithPartialData];
        expectedResult = service.addPreferencesToCollectionIfMissing(preferencesCollection, preferences);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(preferences);
      });

      it('should add only unique Preferences to an array', () => {
        const preferencesArray: IPreferences[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const preferencesCollection: IPreferences[] = [sampleWithRequiredData];
        expectedResult = service.addPreferencesToCollectionIfMissing(preferencesCollection, ...preferencesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const preferences: IPreferences = sampleWithRequiredData;
        const preferences2: IPreferences = sampleWithPartialData;
        expectedResult = service.addPreferencesToCollectionIfMissing([], preferences, preferences2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(preferences);
        expect(expectedResult).toContain(preferences2);
      });

      it('should accept null and undefined values', () => {
        const preferences: IPreferences = sampleWithRequiredData;
        expectedResult = service.addPreferencesToCollectionIfMissing([], null, preferences, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(preferences);
      });

      it('should return initial array if no Preferences is added', () => {
        const preferencesCollection: IPreferences[] = [sampleWithRequiredData];
        expectedResult = service.addPreferencesToCollectionIfMissing(preferencesCollection, undefined, null);
        expect(expectedResult).toEqual(preferencesCollection);
      });
    });

    describe('comparePreferences', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePreferences(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePreferences(entity1, entity2);
        const compareResult2 = service.comparePreferences(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePreferences(entity1, entity2);
        const compareResult2 = service.comparePreferences(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePreferences(entity1, entity2);
        const compareResult2 = service.comparePreferences(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

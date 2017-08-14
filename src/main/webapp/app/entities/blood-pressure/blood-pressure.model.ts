import { BaseEntity, User } from './../../shared';

export class BloodPressure implements BaseEntity {
    constructor(
        public id?: number,
        public timestamp?: any,
        public systolic?: number,
        public diastolic?: number,
        public user?: User,
    ) {
    }
}

import { User } from '../../shared';
export class BloodPressure {
    constructor(
        public id?: number,
        public timestamp?: any,
        public systolic?: number,
        public diastolic?: number,
        public user?: User,
    ) {
    }
}

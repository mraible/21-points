import { BaseEntity, User } from './../../shared';

const enum Units {
    'kg',
    'lb'
}

export class Preferences implements BaseEntity {
    constructor(
        public id?: number,
        public weeklyGoal?: number,
        public weightUnits?: Units,
        public user?: User,
    ) {
    }
}

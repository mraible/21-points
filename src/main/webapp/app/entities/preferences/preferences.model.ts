import { BaseEntity, User } from './../../shared';

export const enum Units {
    'kg',
    'lb'
}

export class Preferences implements BaseEntity {
    constructor(
        public id?: number,
        public weekly_goal?: number,
        public weight_units?: Units,
        public user?: User,
    ) {
    }
}

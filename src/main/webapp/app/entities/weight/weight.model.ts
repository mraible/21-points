import { BaseEntity, User } from './../../shared';

export class Weight implements BaseEntity {
    constructor(
        public id?: number,
        public timestamp?: any,
        public weight?: number,
        public user?: User,
    ) {
    }
}

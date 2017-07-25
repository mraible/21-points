import { User } from '../../shared';
export class Weight {
    constructor(
        public id?: number,
        public timestamp?: any,
        public weight?: number,
        public user?: User,
    ) {
    }
}

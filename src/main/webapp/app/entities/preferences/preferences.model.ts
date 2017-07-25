
const enum Units {
    'kg',
    'lb'

};
import { User } from '../../shared';
export class Preferences {
    constructor(
        public id?: number,
        public weeklyGoal?: number,
        public weightUnits?: Units,
        public user?: User,
    ) {
    }
}

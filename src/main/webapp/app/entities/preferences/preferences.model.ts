
const enum Units {
    'kg',
    'lb'

};
import { User } from '../../shared';
export class Preferences {
    constructor(
        public id?: number,
        public weekly_goal?: number,
        public weight_units?: Units,
        public user?: User,
    ) {
    }
}

import { AlationKey } from '../types';
export interface IUpdateResponse {
    'new_objects': number;
    'updated_objects': number;
    'number_received': number;
    'error_objects': Array<string>;
    'error': string;
}
export interface IAlationUpdateBase {
    'key': AlationKey;
}
//# sourceMappingURL=update.d.ts.map
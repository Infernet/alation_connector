import { JobStatusEnum } from '../types';
import { IUpdateResponse } from './update';
export interface IJob {
    'job_name': string;
}
export declare type IJobSerialize = Pick<IJobState, 'msg'> & {
    status: JobStatusEnum.RUNNING;
} | Pick<IJobState, 'msg'> & {
    status: JobStatusEnum.FAILED | JobStatusEnum.SUCCESSFUL;
    result: string;
};
export interface IJobState {
    status: JobStatusEnum;
    msg: string;
}
export interface IJobFinish extends IJobState {
    status: JobStatusEnum.SUCCESSFUL | JobStatusEnum.FAILED;
    result: IUpdateResponse;
}
//# sourceMappingURL=job.d.ts.map
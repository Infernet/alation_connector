export declare type Flag = true;
export declare type CustomFieldId = number;
export declare type AlationEntityId = number;
export declare type AlationEntityType = 'datasource' | 'schema' | 'table' | 'attribute';
export declare type ObjectType = 'data' | 'schema' | 'table' | 'attribute';
export declare type AlationKey<T extends string = string> = T;
export declare enum JobStatusEnum {
    RUNNING = "running",
    FAILED = "failed",
    SUCCESSFUL = "successful"
}
export declare enum TokenStatusEnum {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED"
}
//# sourceMappingURL=index.d.ts.map
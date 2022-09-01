import { AlationEntityType } from 'src';
export declare const ALATION_NEXT_PAGE_HEADER_KEY = "x-next-page";
export declare const ALATION_CATALOG_ROUTE: {
    [x in AlationEntityType]: string;
};
export declare const ALATION_UPDATE_ROUTE: {
    [x in AlationEntityType]: string;
};
export declare const ALATION_JOB_STATE_ROUTE = "/api/v1/bulk_metadata/job/";
export declare const CUSTOM_FIELD_VALUE_ROUTE = "/api/custom_field_value/";
export declare function alationCreateRoute(datasourceId: number): string;
export declare function regenerateRefreshTokenRoute(baseUrl: string): string;
export declare function createRefreshTokenRoute(baseUrl: string): string;
export declare function createAccessTokenRoute(baseUrl: string): string;
export declare function validateAccessTokenRoute(baseUrl: string): string;
export declare function validateRefreshTokenRoute(baseUrl: string): string;
export declare const HTTP_STATUS: {
    OK: number;
    BAD_REQUEST: number;
    UNAUTHORIZED: number;
    FORBIDDEN: number;
    NOT_FOUND: number;
    SERVER_ERROR: number;
    NO_CONTENT: number;
};
//# sourceMappingURL=index.d.ts.map
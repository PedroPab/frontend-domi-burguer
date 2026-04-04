export const POINT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
} as const;

export const POINT_FLOW_TYPES = {
    INPUT: 'input',
    OUTPUT: 'output',
} as const;

export const POINT_TYPES = {
    REWARD_CODE: 'reward_code',
    ORDER: 'order',
    BONUS: 'bonus',
    REDEMPTION: 'redemption',
} as const;

export const POINT_REFERENCE_TYPES = {
    ORDER: 'order',
    CODE: 'code',
} as const;

export type PointStatus = (typeof POINT_STATUS)[keyof typeof POINT_STATUS];
export type PointFlowType = (typeof POINT_FLOW_TYPES)[keyof typeof POINT_FLOW_TYPES];
export type PointType = (typeof POINT_TYPES)[keyof typeof POINT_TYPES];
export type PointReferenceType = (typeof POINT_REFERENCE_TYPES)[keyof typeof POINT_REFERENCE_TYPES];

export interface FirebaseTimestamp {
    _seconds: number;
    _nanoseconds: number;
}

export interface Point {
    id: string;
    userId: string;
    userIdCreate: string;
    points: number;
    description: string;
    flowType: PointFlowType;
    type: PointType;
    eventId: string | null;
    referenceId: string | null;
    referenceType: PointReferenceType | null;
    status: PointStatus;
    createdAt: FirebaseTimestamp;
    updatedAt: FirebaseTimestamp;
}

export interface PointsResponse {
    body: Point[];
}

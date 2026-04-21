export type CodeStatus = 'active' | 'inactive';

export type CodeType = 'referral' | 'claim_of_prizes';

export type RewardType = 'fixedPriceInElement' | 'discount' | 'freeProduct' | 'freeElement';

export type RewardAddType = 'product' | 'complement';

export interface RewardElement {
    id: string;
    quantity?: number;
    complements?: string[];
    price?: number;
    note?: string;
}

export interface Reward {
    type: RewardType;
    typeAddReward: RewardAddType;
    elements: RewardElement[];
}

export interface Code {
    id: string;
    code: string;
    userId?: string;
    userCreateId?: string;
    productIds?: Array<number | string> | null;
    type: CodeType;
    description?: string;
    usageLimit?: number | null;
    usageCount: number;
    expirationDate?: Date | null;
    status: CodeStatus;
    reward: Reward | null;
    createdAt: Date;
    updatedAt: Date;
}

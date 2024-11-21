export interface ItemResponse{
    id: number;
    name: string;
    description: string;
    categoryName: string;
    condition:  "PENDING" | "APPROVED" | "REJECTED";

    userName: string;
    
}

export enum Condition{
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}
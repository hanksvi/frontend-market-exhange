export interface ItemResponse{
    id: number;
    name: string;
    description: string;
    categoryName: string;
    condition: "NEW" | "USED";
    userName: string;
    createdAt: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    imageUrl: String;
    
}

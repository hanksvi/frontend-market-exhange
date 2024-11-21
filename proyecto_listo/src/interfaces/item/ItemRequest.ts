export interface item{
    name: string;
    description: string;
    category_id: number;
    user_id: number;
    condition: "NEW" | "USED";
}
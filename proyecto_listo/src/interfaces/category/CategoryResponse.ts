import { ItemResponse } from "@interfaces/item/ItemResponse";

export interface CategoryResponse{
     name: string;
    description: string;
    items: ItemResponse[];
}
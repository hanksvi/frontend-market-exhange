export interface ItemRequest {
    name: string;
    description: string;
    category_id: number;
    user_id: number; // Si el usuario actual ya está autenticado, este puede ser omitido en el frontend y gestionado por el backend.
    condition: "NEW" | "USED";
    image?: File;
  }
  
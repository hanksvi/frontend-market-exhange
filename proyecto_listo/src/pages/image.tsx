import React from 'react';
import item from "../services/item/item"

function ItemComponent({ item }) {
    return (
        <div className="item">
            <h2>{item.name}</h2>
            <img src={`http://tu-dominio.com${item.imageUrl}`} alt={item.name} />
            {/* Asegúrate de ajustar la URL base según tu configuración */}
        </div>
    );
}

export default ItemComponent;
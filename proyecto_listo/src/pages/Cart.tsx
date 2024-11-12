import React, { useEffect, useState } from "react";
import api from "../apis/api";
import { useAuth } from "../auth/AuthProvider";

interface CartItem {
    itemId: string;
    qty: number;
    title: string;
    price: number;
    imgUrl: string;
}

export default function Cart() {
    const auth = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await api.get(`/cart/${auth.userId}`);
                // Necesitas mapear los productos para incluir detalles como título, precio, etc.
                setCartItems(response.data.products);
            } catch (error) {
                console.error("Error al obtener el carrito:", error);
            }
            setLoading(false);
        };
        fetchCart();
    }, [auth.userId]);

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
            {cartItems.length === 0 ? (
                <p>No hay productos en el carrito</p>
            ) : (
                cartItems.map((item) => (
                    <div key={item.itemId} className="border p-4 mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p>Cantidad: {item.qty}</p>
                        <p>Precio: ${item.price}</p>
                        {/* Opciones para editar o eliminar */}
                    </div>
                ))
            )}
        </div>
    );
}
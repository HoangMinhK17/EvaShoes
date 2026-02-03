import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);

    const addToCart = useCallback((product, quantity = 1, color = null, size = null) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                item =>
                    item.product._id === product._id &&
                    item.color === color &&
                    item.size === size
            );

            if (existingItem) {
                return prevItems.map(item =>
                    item === existingItem
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [
                    ...prevItems,
                    {
                        product,
                        quantity,
                        price: product.sellPrice || product.price,
                        color,
                        size,
                    }
                ];
            }
        });
    }, []);

    const removeFromCart = useCallback((productId, color = null, size = null) => {
        setCartItems(prevItems =>
            prevItems.filter(
                item =>
                    !(item.product._id === productId &&
                    item.color === color &&
                    item.size === size)
            )
        );
    }, []);

    const updateQuantity = useCallback((productId, quantity, color = null, size = null) => {
        if (quantity <= 0) {
            removeFromCart(productId, color, size);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.product._id === productId &&
                    item.color === color &&
                    item.size === size
                        ? { ...item, quantity }
                        : item
                )
            );
        }
    }, [removeFromCart]);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }, [cartItems]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const toggleShowCart = useCallback(() => {
        setShowCart(prev => !prev);
    }, []);

    const openCart = useCallback(() => {
        setShowCart(true);
    }, []);

    const closeCart = useCallback(() => {
        setShowCart(false);
    }, []);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart,
        cartCount: cartItems.length,
        showCart,
        setShowCart,
        toggleShowCart,
        openCart,
        closeCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

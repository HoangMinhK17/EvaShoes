import React, { createContext, useState, useCallback, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const API_URL = 'http://localhost:3001/api/evashoes';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [isLoadingCart, setIsLoadingCart] = useState(false);

    // Lấy AuthContext để có access tới user và token
    const auth = useContext(AuthContext);

    // Load cart từ DB khi user login
    useEffect(() => {
        if (auth?.user?._id) {
            loadCartFromDB(auth.user._id, auth.token);
        } else {
            // Nếu user logout, xóa cart
            setCartItems([]);
        }
    }, [auth?.user?._id]);

    // Load cart từ database
    const loadCartFromDB = useCallback(async (userId, token) => {
        setIsLoadingCart(true);
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/cart/?userId=${userId}`, {
                method: 'GET',
                headers,
            });

            const data = await response.json();

            if (response.ok && data.items) {
                setCartItems(data.items);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            setCartItems([]);
        } finally {
            setIsLoadingCart(false);
        }
    }, []);

    // Save cart to database
    const saveCartToDB = useCallback(async (items, totalPrice, userId, token) => {
        try {
            if (!userId) return;

            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/cart/add`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    userId,
                    items,
                    totalPrice,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error saving cart:', error);
            }
        } catch (error) {
            console.error('Error saving cart to DB:', error);
        }
    }, []);

    const addToCart = useCallback((product, quantity = 1, color = null, size = null) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(
                item =>
                    item.product._id === product._id &&
                    item.color === color &&
                    item.size === size
            );

            let newItems;
            if (existingItem) {
                newItems = prevItems.map(item =>
                    item === existingItem
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [
                    ...prevItems,
                    {
                        product: product._id,
                        quantity,
                        price: product.sellPrice || product.price,
                        color,
                        size,
                    }
                ];
            }
            
            // Save to DB
            const totalPrice = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            saveCartToDB(newItems, totalPrice, auth?.user?._id, auth?.token);

            return newItems;
        });
    }, [auth?.user?._id, auth?.token, saveCartToDB]);

    const removeFromCart = useCallback((productId, color = null, size = null) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(
                item =>
                    !(item.product._id === productId &&
                    item.color === color &&
                    item.size === size)
            );

            // Save to DB
            const totalPrice = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            saveCartToDB(newItems, totalPrice, auth?.user?._id, auth?.token);

            return newItems;
        });
    }, [auth?.user?._id, auth?.token, saveCartToDB]);

    const updateQuantity = useCallback((productId, quantity, color = null, size = null) => {
        if (quantity <= 0) {
            removeFromCart(productId, color, size);
        } else {
            setCartItems(prevItems => {
                const newItems = prevItems.map(item =>
                    item.product._id === productId &&
                    item.color === color &&
                    item.size === size
                        ? { ...item, quantity }
                        : item
                );

                // Save to DB
                const totalPrice = newItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );
                saveCartToDB(newItems, totalPrice, auth?.user?._id, auth?.token);

                return newItems;
            });
        }
    }, [auth?.user?._id, auth?.token, removeFromCart, saveCartToDB]);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }, [cartItems]);

    const clearCart = useCallback(async () => {
        try {
            if (!auth?.user?._id) return;

            const headers = {
                'Content-Type': 'application/json',
            };

            if (auth?.token) {
                headers['Authorization'] = `Bearer ${auth.token}`;
            }

            await fetch(`${API_URL}/cart/clear`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId: auth.user._id }),
            });

            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    }, [auth?.user?._id, auth?.token]);

    const toggleShowCart = useCallback(() => {
        setShowCart(prev => !prev);
    }, []);

    const openCart = useCallback(() => {
        setShowCart(true);
    }, []);

    const closeCart = useCallback(() => {
        setShowCart(false);
    }, []);

    const value = useMemo(() => ({
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
        isLoadingCart,
    }), [cartItems, addToCart, removeFromCart, updateQuantity, getTotalPrice, clearCart, showCart, setShowCart, toggleShowCart, openCart, closeCart, isLoadingCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

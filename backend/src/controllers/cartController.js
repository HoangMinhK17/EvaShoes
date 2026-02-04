import Cart from "../models/Cart.js";

const getCartItems = async (req, res) => {
    try {
        const idUser = req.body.userId || (req.user && req.user._id);

        if (!idUser) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const cartItems = await Cart.findOne({ user: idUser })
            .populate('items.product', 'name price sellPrice imageUrl sizes colors isSale')
            .lean();

        if (!cartItems) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const idUser = req.body.userId || (req.user && req.user._id);

        if (!idUser) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { items, totalPrice } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items are required and must be a non-empty array' });
        }

        if (typeof totalPrice !== 'number' || totalPrice < 0) {
            return res.status(400).json({ message: 'Valid totalPrice is required' });
        }
        // ✅ Merge items trùng nhau theo (product, color, size)
        const getPid = (p) => (typeof p === 'string' ? p : (p?._id?.toString?.() || p?.toString?.()));

        const merged = new Map();

        for (const it of items) {
            const pid = getPid(it.product);
            const color = it.color ?? '';
            const size = it.size ?? '';
            const key = `${pid}|${color}|${size}`;

            if (!merged.has(key)) {
                merged.set(key, { ...it, product: pid });
            } else {
                const cur = merged.get(key);
                merged.set(key, {
                    ...cur,
                    quantity: (cur.quantity || 0) + (it.quantity || 0),
                });
            }
        }

        const mergedItems = Array.from(merged.values());

        // OPTIONAL: tính lại totalPrice cho chuẩn
        const mergedTotal = mergedItems.reduce(
            (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
            0
        );

        // Kiểm tra xem user đã có giỏ hàng chưa
        let cart = await Cart.findOneAndUpdate(
            { user: idUser },
            { $set: { items: mergedItems, totalPrice: mergedTotal } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        if (cart) {

            return res.status(200).json({
                message: 'Cart updated successfully',
                cartItem: cart
            });
        } else {
            // Nếu chưa có, tạo mới
            const newCartItem = new Cart({
                user: idUser,
                items: items,
                totalPrice: totalPrice
            });

            await newCartItem.save();

            return res.status(201).json({
                message: 'Item added to cart',
                cartItem: newCartItem
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const idUser = req.body.userId || (req.user && req.user._id);

        if (!idUser) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Xóa item khỏi giỏ hàng
        const cart = await Cart.findOne({ user: idUser });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({
            message: 'Item removed from cart',
            cartItem: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const idUser = req.body.userId || (req.user && req.user._id);

        if (!idUser) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        await Cart.deleteOne({ user: idUser });

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getCartItems, addItemToCart, removeItemFromCart, clearCart };
import { mongo } from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const createOrder = async (req, res) => {
    try {
        const { user, items, totalPrice, paymentMethod, shippingAddress, notes, codeOrder } = req.body;
        const order = new Order({
            user,
            items,
            totalPrice,
            paymentMethod,
            shippingAddress,
            notes,
            codeOrder
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({ path: "items.product", select: "name " })
            .populate({ path: "user", select: "name email" });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id }).populate({ path: "items.product", select: "name price image" }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const { status } = req.query;

        let filter = {};
        if (status) {
            filter.status = status;
        }
        const orders = await Order.find(filter).populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const searchOrders = async (req, res) => {
    try {
        const { query } = req.params;
        if (!query || !query.trim()) {
            const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
            return res.status(200).json(orders);

        }
        const orders = await Order.find({
            $or: [
                { codeOrder: { $regex: query, $options: 'i' } },
                { 'shippingAddress.fullName': { $regex: query, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: query, $options: 'i' } }
            ]
        }).populate("user", "name email").sort({ createdAt: -1 });
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const updateStatusOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, cancelReason } = req.body;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status === 'cancelled') {
            order.cancelAt = new Date();
            order.paymentStatus = 'failed';
            order.cancelReason = cancelReason || null;
        }

        if (status === 'delivered') {
            order.paymentStatus = 'paid';
            order.deliveredAt = new Date();

            // Update stock and sold count for each product
            for (const item of order.items) {
                const productId = item.product?._id || item.product; // nếu populate thì có _id
                const sizeValue = Number(item.size); // ép về Number để match schema

                const updated = await Product.findOneAndUpdate(
                    { _id: productId, "sizes.size": sizeValue },
                    {
                        $inc: {
                            "sizes.$[s].stock": -item.quantity,
                            sold: item.quantity,
                        },
                    },
                    {
                        new: true,
                        arrayFilters: [{ "s.size": sizeValue }],
                    }
                );

            }
        }

        order.status = status;
        await order.save();
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export { createOrder, getOrderById, getOrders, updateOrder, deleteOrder, getOrdersByUser, searchOrders, updateStatusOrder };
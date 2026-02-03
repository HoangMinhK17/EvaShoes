import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
            },
            color: {
                type: String,
            },
            size: {
                type: Number,
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'banking'],
        default: 'cod',
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        ward: String,
        district: String,
    },
    notes: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;

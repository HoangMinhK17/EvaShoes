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
        enum: ['COD', 'card', 'banking'],
        default: 'COD',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },

    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        district: String,
        ward: String,
    },
    notes: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    cancelAt: {
        type: Date,
        default: null,
    },
    cancelReason: {
        type: String,
        default: null,
    },
    codeOrder: {
        type: String,
        default: null,
    },
    deliveredAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;

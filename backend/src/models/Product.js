import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sellPrice: {
        type: Number,

    },
    description: {
        type: String,
        required: true,
    },

    productDetails: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    imageUrl: [{
        type: String,
        required: true,
    }],
    colors: [
        {
            name: String,       // tím, đen, trắng...
            code: String,       // #a88bcc
            image: String,      // ảnh theo màu (nếu có)
        }
    ],
    size: [{
        type: Number,
        stock: Number,
    }],
    isSale: {
        type: Boolean,
        default: true,
    },

    isActive: {
        type: Boolean,
        default: true,
    },
   sold: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
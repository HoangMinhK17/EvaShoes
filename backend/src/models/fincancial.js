import mongoose from "mongoose";
const fincancialSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
 
    
    
})
const Fincancial = mongoose.model('Fincancial', fincancialSchema);
export default Fincancial;

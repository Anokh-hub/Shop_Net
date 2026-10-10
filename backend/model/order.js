const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
    }
    ],
    totalAmount: { type: Number, required: true },
    address: {
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        postCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, default: null },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

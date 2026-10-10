const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../model/order");
const Product = require("../model/Product");

const createRazorpayClient = () => {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay credentials are not configured");
    }
    return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
};

const createOrder = async (req, res) => {
    try {
        const { items, address } = req.body;
        if (!Array.isArray(items) || items.length === 0 || !address ||
            !address.fullName || !address.street || !address.city ||
            !address.postCode || !address.country) {
            return res.status(400).json({ message: "Items and a complete shipping address are required" });
        }

        const normalizedItems = [];
        for (const item of items) {
            const { productId, qty } = item;
            if (!mongoose.isValidObjectId(productId) || !Number.isInteger(qty) || qty < 1) {
                return res.status(400).json({ message: "Each item needs a valid productId and positive integer qty" });
            }
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: `Product ${productId} was not found` });
            if (product.stock < qty) {
                return res.status(409).json({ message: `Insufficient stock for ${product.name}` });
            }
            normalizedItems.push({ productId: product._id, qty, price: product.price });
        }

        const totalAmount = normalizedItems.reduce((total, item) => total + item.price * item.qty, 0);
        const amountInPaise = Math.round(totalAmount * 100);
        if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
            return res.status(400).json({ message: "Order amount is invalid" });
        }

        const razorpayOrder = await createRazorpayClient().orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `shopnet_${Date.now()}`
        });

        const order = await Order.create({
            user: req.user._id,
            items: normalizedItems,
            totalAmount,
            address,
            razorpayOrderId: razorpayOrder.id
        });

        return res.status(201).json({
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Razorpay order creation failed:", error.message);
        return res.status(500).json({ message: "Could not create payment order" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!mongoose.isValidObjectId(orderId) || !razorpay_order_id ||
            !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Order and Razorpay payment details are required" });
        }

        const order = await Order.findOne({ _id: orderId, user: req.user._id });
        if (!order) return res.status(404).json({ message: "Order not found" });
        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ message: "Payment does not match this order" });
        }
        if (order.paymentStatus === "paid") {
            return res.status(200).json({ message: "Payment already verified", orderId: order._id, order });
        }

        const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest();
        const received = Buffer.from(razorpay_signature, "hex");
        if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        order.razorpayPaymentId = razorpay_payment_id;
        order.paymentStatus = "paid";
        await order.save();
        return res.status(200).json({ message: "Payment verified successfully", orderId: order._id, order });
    } catch (error) {
        console.error("Payment verification failed:", error.message);
        return res.status(500).json({ message: "Could not verify payment" });
    }
};

module.exports = { createOrder, verifyPayment };

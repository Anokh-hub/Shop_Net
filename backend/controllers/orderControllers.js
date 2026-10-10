const Order = require('../model/order');

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.productId', 'name price');
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').populate('items.productId', 'name price');
        return res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            if (!['pending', 'shipped', 'delivered'].includes(status)) {
                return res.status(400).json({ message: 'Invalid order status' });
            }
            order.status = status;
            await order.save();
            return res.json({ message: 'Order status updated', order });
        }
        else {
            res.status(404).json({ message: 'Order not found' });

        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
}

module.exports = {
    myOrders,
    getOrders,
    updateOrderStatus
}

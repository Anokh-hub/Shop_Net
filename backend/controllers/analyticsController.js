const Order = require("../model/order");
const User = require('../model/User');
const Product = require('../model/Product');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});
        const totalRevenuData = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenuData
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
}
module.exports = { getAdminStats }; 

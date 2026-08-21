const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
connectDB()

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("ShopNet Backend is working properly!");
});

app.use('/api/auth', require("./router/authRouter"));
app.use('api/product', require('./router/productRouter'));
// app.use('api/orders', require('./router/orderRouter.js'));
// app.use('api/payment', require('./router/paymentRouter.js/index.js'));
// app.use('api/analytic', require('./router/analyticsRouter.js/index.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
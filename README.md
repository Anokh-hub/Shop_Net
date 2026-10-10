# 🛒 ShopNet — E-Commerce Platform

ShopNet is a full-stack e-commerce web application built to provide a seamless online shopping experience. Users can explore products, manage their shopping cart, place orders, and make payments through an integrated payment system.

The application also includes order management, email notifications, user authentication, and an admin panel for managing products and orders.

## ✨ Features

- **User Authentication** — Secure user registration and login.
- **Product Management** — Browse products and view product details.
- **Shopping Cart** — Add, remove, and manage products in the cart.
- **Order Management** — Place orders and track order details.
- **Payment Integration** — Process payments through an integrated payment gateway.
- **Email Notifications** — Send emails for relevant user and order activities.
- **Admin Dashboard** — Manage products, orders, and other administrative tasks.
- **Responsive UI** — Designed for a smooth experience across different screen sizes.

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router
- Redux Toolkit

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Additional Technologies**
- REST APIs
- JWT Authentication
- Payment Gateway Integration
- Email Service Integration

## 📁 Project Structure

```text
ShopNet/
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── package.json
└── README.md
```

*Note: Update the folder structure above to match your actual project.*

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Anokh-hub/Shop_Net.git
cd Shop_Net
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYMENT_SECRET_KEY=your_payment_secret_key
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_app_password
```

Use the exact variable names required by your backend code. Add other variables if your payment or email provider requires them.

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The frontend will generally run at `http://localhost:3000`, and the backend will run at `http://localhost:5000`.

## 🔐 Environment Variables

- Store sensitive credentials in environment variables.
- Never commit your `.env` file or payment secrets to GitHub.
- Configure the required environment variables before running the application.

## 🚀 Future Improvements

- Product search and advanced filtering
- Product reviews and ratings
- Wishlist functionality
- Improved order tracking
- Enhanced performance and security

## 👨‍💻 Author

**Anokh Prajapati**

GitHub: [Anokh-hub](https://github.com/Anokh-hub)

---

If you find this project useful, consider giving the repository a ⭐.

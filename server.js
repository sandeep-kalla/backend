import express from 'express';
import session from 'express-session';
import connectDB from './config/db.js';
import MongoStore from 'connect-mongo';
import userRoutes from './modules/user/routes/user.route.js';
import productRoutes from './modules/product/routes/product.route.js';
import orderRoutes from './modules/orders/routes/order.route.js';
import { errorHandler } from './utils/error.handler.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Change this to your own secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // MongoDB connection URL
    collectionName: 'sessions', // Collection to store sessions
  }),
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}🙃`);
});

import express from 'express';
import itemRoutes from './routes/itemRoutes.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import connectDB from './config/database.ts'
import authRoutes from './routes/auth/auth.ts';
import userRoutes from './routes/user/user.ts';
import orderRoutes from './routes/order/order.ts';


const app = express();

app.use(express.json());

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);

// Define order routes
app.use('/order', orderRoutes);

// Routes
app.use('/api/items', itemRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.ts';
import connectDB from './config/database.ts'

// routes
import itemRoutes from './routes/itemRoute.ts';
import authRoutes from './routes/auth/index.ts';
import userRoutes from './routes/user/index.ts';
import orderRoutes from './routes/order/index.ts';


const app = express();

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
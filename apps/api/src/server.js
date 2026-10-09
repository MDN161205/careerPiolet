import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import mockRoutes from './routes/mockRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Mounted Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/mock', mockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
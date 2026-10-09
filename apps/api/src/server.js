import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js';
import careerRoutes from './routes/careerRoutes.js';
import mockRoutes from './routes/mockRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Mounted Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/mock', mockRoutes);
// Add to mounted routes s-9:
app.use('/api/portfolio', portfolioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
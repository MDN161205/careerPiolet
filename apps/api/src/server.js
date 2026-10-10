import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import mockRoutes from './routes/mockRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Enable CORS for cross-origin production requests
app.use(cors());
app.use(express.json());

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.json({ message: 'CareerPilot AI API is healthy and connected!' });
});

// Mounted API Routes
app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/mock', mockRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Production Deployment Static Serving (if serving combined build)
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/apps/web/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'apps', 'web', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('CareerPilot AI Development API Running...');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
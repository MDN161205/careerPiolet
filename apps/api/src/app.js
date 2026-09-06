import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js'; // Add this line

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes 
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "CareerPilot AI API is running"
  });
});

app.get('/', (req, res) => {
  res.send('CareerPilot AI API Server');
});

export default app;
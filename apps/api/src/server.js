import dotenv from 'dotenv';
dotenv.config();

import careerRoutes from './routes/careerRoutes.js';
import app from './app.js';
import connectDB from './config/db.js';

app.use('/api/career', careerRoutes);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CareerPilot AI API running on port ${PORT}`);
});
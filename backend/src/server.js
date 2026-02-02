import express from 'express';
import taskRoutes from './routes/taskRouters.js';
import categoryRoutes from './routes/categoryRouters.js';
import connectDB from './config/db.js';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
connectDB();
app.use(express.json());
app.use('/api/evashoes/', taskRoutes
                        , categoryRoutes
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


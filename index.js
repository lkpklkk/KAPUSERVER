import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import specs from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';
import userRouter from './routes/user.js';
import carRouter from './routes/car.js';
import locationRouter from './routes/location.js';
import tripRouter from './routes/trip.js';
const app = express();

dotenv.config();
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectDb();

// auto Create api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/user', userRouter);
app.use('/car', carRouter);
app.use('/location', locationRouter);
app.use('/trip', tripRouter);
const PORT = process.env.NODE_LOCAL_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

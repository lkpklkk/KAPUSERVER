import express from 'express';
import dotenv from 'dotenv';
import User from './Models/User.js';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import specs from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';
import userRouter from './routes/user.js';
const app = express();

dotenv.config();
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectDb();

// auto Create api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/user', userRouter);

const PORT = process.env.NODE_LOCAL_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

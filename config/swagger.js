import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();
const url = process.env.SERVER_URL || 'localhost:3000';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple Express API',
    },
    servers: [
      {
        url: url,
      },
    ],
  },
  apis: ['./routes/*.js'], // Files with annotations
};

const specs = swaggerJsdoc(options);
export default specs;

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const {fourOFour, globalErrorHandler} = require('./app/middlewares/errorHandler');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('./database/mongo')();
const app = express();

//routes
const authRoutes = require('./routes/auth');

//check app env state
const isProduction = process.env.NODE_ENV === 'production';

//api rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 requests,
});

const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(compression());
app.use(helmet());
app.use(limiter);

//auth routes
app.use('/api/auth', authRoutes);

app.use(fourOFour);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`server is running on http://127.0.0.1:${PORT}`);
});
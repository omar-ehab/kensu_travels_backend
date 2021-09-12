require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const {fourOFour, globalErrorHandler} = require('./src/app/middlewares/errorHandler');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('./src/database/mongo')();
const app = express();

//routes
const authRoutes = require('./src/routes/auth');
const adminAuthRoutes = require('./src/routes/admin/auth');
const adminApiRoutes = require('./src/routes/admin/api');

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
app.use(cors());
app.use(limiter);

//admin auth routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminApiRoutes);

//auth routes
app.use('/api/auth', authRoutes);

app.use(fourOFour);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`server is running on http://127.0.0.1:${PORT}`);
});
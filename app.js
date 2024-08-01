const express = require('express');
const dotenv = require('dotenv');
const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/authRoutes');
const AppError = require('./utils/errors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Use JSON middleware for parsing application/json
app.use(express.json());

// Define your routes
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error('Unexpected error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

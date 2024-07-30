const express = require('express');
const postRouter = require('./routes/postRoutes');
const errorHandler = require('./middlewares/errorHandler'); // Assuming you have a middleware for handling errors

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/posts', postRouter);

app.use(errorHandler); // Use the error handler middleware

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

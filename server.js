const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const sanitize = require('./utils/sanitize');
const postService = require('./services/postService');
const postRouter = require('./routes/postRoutes'); // Import the router

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

app.post('/api/posts', upload.single('image'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content } = req.body;
  const sanitizedTitle = sanitize(title);
  const sanitizedContent = sanitize(content);
  const post = {
    title: sanitizedTitle,
    content: sanitizedContent,
    imageUrl: req.file ? req.file.path : null,
  };

  try {
    const newPost = await postService.createPost(post);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Service error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.use('/', postRouter); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// controllers/postController.js
const multer = require('multer');
const path = require('path');
const { validationResult } = require('express-validator');
const sanitize = require('../utils/sanitize');
const postService = require('../services/postService');
const AppError = require('../utils/errors');

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
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new AppError('Only images are allowed', 400));
    }
  },
}).single('image');

const createPost = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(
        errors.array().map(err => ({ [err.param]: err.msg })).join(', '),
        400
      );
    }

    const { title, content } = req.body;
    if (!title || !content) {
      throw new AppError('Title and content are required.', 400);
    }

    const sanitizedTitle = sanitize(title);
    const sanitizedContent = sanitize(content);
    const post = {
      title: sanitizedTitle,
      content: sanitizedContent,
      imageUrl: req.file.path,
    };

    const newPost = await postService.createPost(post);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
};

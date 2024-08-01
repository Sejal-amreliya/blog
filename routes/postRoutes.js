const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post(
  '/',
  protect,
  // [
  //   body('title').notEmpty().withMessage('Title is required'),
  //   body('content').notEmpty().withMessage('Content is required')
  // ],
  postController.createPost
);

router.get('/', protect, postController.getAllPosts);
router.get('/:id', protect, postController.getPostById);

module.exports = router;

const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/postController');

const router = express.Router();

router.post(
  '/',
  // [
  //   body('title').notEmpty().withMessage('Title is required'),
  //   body('content').notEmpty().withMessage('Content is required')
  // ],
  postController.createPost
);

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

module.exports = router;

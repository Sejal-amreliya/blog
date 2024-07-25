const express = require('express');
const postController = require('../controllers/postController');
const { body } = require('express-validator');

const router = express.Router();

router.post(
    '/',
    postController.createPost
  );

  router.get('/api/posts', postController.getAllPosts);
  router.get('/:id', postController.getPostById);

module.exports = router;

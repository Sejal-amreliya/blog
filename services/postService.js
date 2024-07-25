const db = require('../models');

const createPost = async (post) => {
    try {
      const newPost = await db.posts.create(post);
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  

const getAllPosts = async () => {
  return await db.posts.findAll();
};

const getPostById = async (id) => {
  return await db.posts.findByPk(id);
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
};

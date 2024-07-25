const multer = require('multer');
const path = require('path');
const sanitize = require('../utils/sanitize');
const postService = require('../services/postService');
const { validationResult } = require('express-validator');

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
}).single('image');

const createPost = async (req, res, next) => {
    console.log('Received request for creating post');
    console.log('Request headers:', req.headers);
    console.log('Request body before upload:', req.body);

    upload(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }

        console.log('File uploaded successfully');
        console.log('Request body after upload:', req.body);
        console.log('Uploaded file details:', req.file);

        // Validation should be done after multer has processed the body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required.' });
        }

        const sanitizedTitle = sanitize(title);
        const sanitizedContent = sanitize(content);
        const post = {
            title: sanitizedTitle,
            content: sanitizedContent,
            imageUrl: req.file.path,
        };

        try {
            const newPost = await postService.createPost(post);
            res.status(201).json(newPost);
        } catch (error) {
            console.error('Service error:', error);
            next(error);
        }
    });
};


const getAllPosts = async (req, res, next) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Service error:', error);
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Service error:', error);
        next(error);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
};

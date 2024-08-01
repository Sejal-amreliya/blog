const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const AppError = require('../utils/errors');
const multer = require('multer');

const upload = multer().none(); // No file uploads, just form-data fields

const register = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new AppError('Error processing form-data', 400));
    }

    try {
      const { username, password } = req.body;
      if (!username || !password) {
        throw new AppError('Username and password are required.', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await db.users.create({ username, password: hashedPassword });

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  });
};

const login = async (req, res, next) => {
    try {
      console.log("Request Body:", req.body); // Log the request body
  
      const { username, password } = req.body;
      console.log("Parsed Username:", username);
      console.log("Parsed Password:", password);
  
      if (!username || !password) {
        throw new AppError('Username and password are required.', 400);
      }
  
      const user = await db.users.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Invalid username or password', 401);
      }
  
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ token });
    } catch (error) {
      next(error);
    }
  };
  
module.exports = {
  register,
  login,
};

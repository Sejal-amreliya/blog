// app.js
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
app.use(express.static('public'));

// Set up EJS templating engine
app.set('view engine', 'ejs');

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up MySQL connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1997',
  database: 'blog'
});

// Define routes
app.get('/', async (req, res) => {
  const [rows, fields] = await db.execute('SELECT * FROM blogs');
  res.render('index', { blogs: rows });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { title, content } = req.body;
  await db.execute('INSERT INTO blogs (title, content) VALUES (?, ?)', [title, content]);
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
  res.render('edit', { blog: rows[0] });
});

app.post('/edit/:id', async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  await db.execute('UPDATE blogs SET title = ?, content = ? WHERE id = ?', [title, content, id]);
  res.redirect('/');
});

app.get('/blog/:id', async (req, res) => {
  const id = req.params.id;
  const [rows, fields] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
  res.render('blog', { blog: rows[0] });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
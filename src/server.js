const express = require('express')
const {openDb} = require("./db")

const session = require('express-session')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
const SQLiteStore = require('connect-sqlite3')(session);
const port = 5000
const sess = {
    store: new SQLiteStore,
    secret: 'secret key',
    resave: true,
    rolling: true,
    cookie: {
      maxAge: 1000 * 3600//ms
    },
    saveUninitialized: true
  }


if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies

}

app.use(session(sess))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'jade');



app.get('/login',(req, res) => {
    res.render('login', {logged: req.session.logged})
})
  
app.post('/login', async(req, res) => {
  const email= req.body.email
  const password = req.body.password
  const db = await openDb()
  let data = {
  }
  if(email===undefined || password===undefined){
    data={
      errors: "Please provide an email and a password",
      logged: false
    }
  }else{
    const user = await db.get(`
      SELECT * FROM users 
      WHERE email = ?
    `,[email])
    
    if(!user || user.password !== password){ //no user is found with this email or incorrect password
      data={
        errors: "Incorrect Email or Password ! Please try again",
        logged: false
      }
    }else {
      req.session.logged = true
      req.session.pseudo = user.pseudo
      req.session.email = user.email
      req.session.user=user
      req.session.iden=user.usr_id
      data = {
        success: "You logged in",
        logged: true
      }
    }
  }

  res.render('login',data)
})

app.get('/logout',(req, res) => {
  req.session.logged = false
  res.render('logout')
})



app.get('/signup',(req, res) => {
  res.render('signup', {logged: req.session.logged})
})

app.post('/signup', async(req, res) => {
  const pseudo= req.body.pseudo
  const email= req.body.email
  const password = req.body.password
  const db = await openDb()
  let data = {
  }
  if(pseudo===undefined || email===undefined || password===undefined){
    console.log('error')
    data={
      errors: "Please fill out all required fields",
      logged: false
    }
  }else{
    const user = await db.get(`
      INSERT INTO users(pseudo,email,password)
      VALUES(?, ?, ?)
    `,[pseudo, email, password])

    data={
      logged: true
    }
  }
  res.render('signup',data)
})


app.get('/profile', async(req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
  }else{
    res.render('profile', {pseudo: req.session.pseudo, email: req.session.email})
  }
})

app.post('/profile', async(req, res) => {
  const pseudo= req.body.pseudo
  const email= req.body.email
  const password = req.body.password
  const db = await openDb()
  let data = {
  }
  if(pseudo===undefined || email===undefined || password===undefined){
    console.log('error')
    data={
      errors: "Please fill out all required fields",
      logged: false
    }
  }else{
    const user = await db.get(`
      INSERT INTO users(pseudo,email,password)
      VALUES(?, ?, ?)
    `,[pseudo, email, password])

    data={
      logged: true
    }
  }
  res.render('signup',data)
})


app.get('/share', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  res.render("share")
})

app.post('/share', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const id = req.params.id
  const content = req.body.share
  const title = req.body.title
  const author=req.session.pseudo
  const usr = req.session.id
  const post = await db.run(`
    INSERT INTO posts(title,author,user,votes,content)
    VALUES(?, ?, ?, ?, ?)
  `,[title, author, usr, 0, content])
  const posts = await db.all(`
      SELECT * FROM posts
    `,)
    const comments = await db.all(`
    SELECT * FROM comments
  `,)
    res.render("home",{posts: posts,logged: req.session.logged, comments: comments})
})

app.get('/comment', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  // res.render("share")
  res.redirect(302,'/home')
})

app.post('/comment', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const content = req.body.comment
  const usr = req.session.iden
  console.log(`${usr}`)
  const post = await db.get(`
    SELECT * FROM posts
    WHERE user = ?
  `,[usr])
  const comment = await db.run(`
    INSERT INTO comments(user,content,post)
    VALUES(?, ?, ?)
  `,[usr,content,post.id])
  const posts = await db.all(`
      SELECT * FROM posts
    `,)
  const comments = await db.all(`
    SELECT * FROM comments
  `,)
  res.render("home",{posts: posts,logged: req.session.logged, comments: comments})
})

app.get('/post/:id/upvote', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const db = await openDb()
  const id = req.params.id
  const post = await db.get(`
    SELECT * FROM posts
    LEFT JOIN users on users.usr_id = posts.user
    WHERE id = ?
  `,[id])
  const posts = await db.all(`
      SELECT * FROM posts
    `,)
  // res.render("home",{posts: posts,logged: req.session.logged})
  res.redirect(302,'/home')
})

app.post('/post/:id/upvote', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const id = req.params.id
  const post = await db.get(`
      SELECT * FROM posts 
      WHERE id = ?
    `,[id])

  await db.run(`
    UPDATE posts
    SET votes = ?
    WHERE id = ?
  `,[post.votes+1, id])
  const posts = await db.all(`
      SELECT * FROM posts
    `,)
    const comments = await db.all(`
    SELECT * FROM comments
  `,)
    res.render("home",{posts: posts,logged: req.session.logged, comments: comments})
})   //a ajputer une table de jointure entre user et posts pour les likes

app.get('/post/:id/downvote', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const db = await openDb()
  const id = req.params.id
  const post = await db.get(`
    SELECT * FROM posts
    LEFT JOIN users on users.usr_id = posts.user
    WHERE id = ?
  `,[id])
  const posts = await db.all(`
      SELECT * FROM posts
    `,)
  // res.render("home",{posts: posts,logged: req.session.logged})
  res.redirect(302,'/home')
})

app.post('/post/:id/downvote', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }

  const db = await openDb()
  const id = req.params.id
  const post = await db.get(`
      SELECT * FROM posts 
      WHERE id = ?
    `,[id])

  await db.run(`
    UPDATE posts
    SET votes = ?
    WHERE id = ?
  `,[post.votes-1, id])
  const posts = await db.all(`
      SELECT * FROM posts
    `,)
    const comments = await db.all(`
    SELECT * FROM comments
  `,)
    res.render("home",{posts: posts,logged: req.session.logged, comments: comments})
})   //a ajputer 

app.get("/", async(req, res) => {
  
  if (req.session.logged===true){
    const db = await openDb()
    const posts = await db.all(`
      SELECT * FROM posts
    `,)
    const comments = await db.all(`
    SELECT * FROM comments
  `,)
    res.render("home",{posts: posts,logged: req.session.logged, comments: comments})
  }else{
    res.redirect(302,'/login')
  }
  
  //res.render("blog")
})

app.get('/post/:id', async(req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
  }else{
    const db = await openDb()
    const id = req.params.id
    const post = await db.get(`
      SELECT * FROM posts
      WHERE id = ?
    `,[id])
    const votes = post.votes
    res.render('post', {votes: votes})
  }
})

app.listen(port,  () => {
    console.log(`Reddit app listening at http://localhost:${port}`)
  })
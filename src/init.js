const {openDb} = require("./db")

const tablesNames = ["users","posts","comments"]


async function createUsers(db){
  const insertRequest = await db.prepare("INSERT INTO users('pseudo', 'email', 'password') VALUES (?, ?, ?)")
  const users = [{
      pseudo: "bob",
      email: "bob@mail.com",
      password: "bob"
    },
    {
      pseudo: "max",
      email: "max@mail.com",
      password: "max"
    }
    ]
  return await Promise.all(users.map(user => {
    return insertRequest.run([user.pseudo, user.email, user.password])
  }))
}

async function createPosts(db){
  const insertRequest = await db.prepare("INSERT INTO posts(title,author,user,comments,votes,content) VALUES(?, ?, ?, ?, ?, ?)")
  const contents = [{
    title: "Site de recherche !",
    author: "bob",
    user: 1,
    comments: ["Excellent site pour faire des recherches! "],
    votes: 0,
    content: "http://google.fr"
  }
  ]
  return await Promise.all(contents.map(post => {
    return insertRequest.run([post.title, post.author, post.user, post.comments, post.votes, post.content])
  }))
}

async function createComments(db){
  const insertRequest = await db.prepare("INSERT INTO comments(user,content,post) VALUES(?, ?, ?)")
  const contents = [{
    user: 2,
    content: "Excellent site pour faire des recherches! ",
    post: 1
  }
  ]
  return await Promise.all(contents.map(comment => {
    return insertRequest.run([comment.user, comment.content, comment.post])
  }))
}

async function createTables(db){
  const usr = db.run(`
    CREATE TABLE IF NOT EXISTS users(
        usr_id INTEGER PRIMARY KEY AUTOINCREMENT,
        pseudo varchar(255),
        email varchar(255),
        password varchar(255)
      );
  `)
  const post = db.run(`
        CREATE TABLE IF NOT EXISTS posts(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title text NOT NULL,
          author text NOT NULL,
          user int,
          comments varchar(255),
          votes int,
          content text,
          FOREIGN KEY(user) REFERENCES users(usr_id)
        )
  `)
  const comment = db.run(`
        CREATE TABLE IF NOT EXISTS comments(
          cmt_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user int,
          content text,
          post int,
          FOREIGN KEY(user) REFERENCES posts(post_id)
        )
  `)
  return await Promise.all([usr,post,comment])
}


async function dropTables(db){
  return await Promise.all(tablesNames.map( tableName => {
      return db.run(`DROP TABLE IF EXISTS ${tableName}`)
    }
  ))
}

(async () => {
  // open the database
  let db = await openDb()
  await dropTables(db)
  await createTables(db)
  await createUsers(db)
  await createPosts(db)
  await createComments(db)
})

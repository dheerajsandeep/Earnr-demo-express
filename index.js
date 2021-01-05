const express = require("express");

const path = require("path");
const sqlite3 = require("sqlite3").verbose();


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const db_name = path.join(__dirname, "data", "apptest.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
});

app.listen(3000, () => { {
  console.log("Server started (http://localhost:3000/) !");}
});

const sql_create = `CREATE TABLE IF NOT EXISTS Customers (
    Customer_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    First_name VARCHAR(100) NOT NULL,
    Last_name VARCHAR(100) NOT NULL,
    dob DATE,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(12) NOT NULL,
    fund_options VARCHAR(12) NOT NULL,
    fund_amount VARCHAR(20) NOT NULL
  );`;

  //seed method for the database can be used here 




db.run(sql_create, err => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Successful creation of the 'Customers' table");
  });


app.get("/", (req, res) => { {
  //res.send ("Hello world...Test");
  res.render("index");}
});

app.get("/register", (req, res) => {
    res.render("register");
  });


  //data test

  app.get("/data", (req, res) => {
    const test = {
      title: "Test",
      items: ["one", "two", "three"]
    };
    res.render("data", { model: test });
  });


  app.get("/customers", (req, res) => {
    const sql = "SELECT * FROM Customers ORDER BY First_name"
    db.all(sql, [], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("customers", { model: rows });
    });
  });


  app.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM Customers WHERE Customer_ID = ?";
    db.get(sql, id, (err, row) => {
      // if (err) ...
      res.render("edit", { model: row });
    });
  });


  app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const book = [req.body.First_name, req.body.Last_name, req.body.dob,req.body.email,req.body.phone_number,req.body.fund_options,req.body.fund_amount, id];
    const sql = "UPDATE Customers SET First_name = ?, Last_name = ?, dob = ?,email=?,phone_number=?,fund_options=?,fund_amount=? WHERE (Customer_ID = ?)";
    db.run(sql, customer, err => {
      // if (err) ...
      res.redirect("/customers");
    });
  });



  app.get("/create", (req, res) => {
    res.render("create", { model: {} });
  });


  // POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Customers (First_name,Last_name,dob,email,phone_number,fund_options,fund_amount) VALUES (?, ?, ?, ?, ? , ?, ?)";
  const customer = [req.body.First_name, req.body.Last_name, req.body.dob,req.body.email,req.body.phone_number,req.body.fund_options,req.body.fund_amount];
  db.run(sql, customer, err => {
    // if (err) ...
    res.redirect("/customers");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Customers WHERE Customer_ID = ?";
  db.get(sql, id, (err, row) => {
    // if (err) ...
    res.render("delete", { model: row });
  });
});


app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Customers WHERE Customer_ID = ?";
  db.run(sql, id, err => {
    // if (err) ...
    res.redirect("/customers");
  });
});
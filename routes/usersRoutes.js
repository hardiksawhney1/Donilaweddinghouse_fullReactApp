const express = require("express");
const router = express.Router();
const connection = require("../utils/database");
const bcrypt = require("bcrypt");
// process.on('uncaughtException', function (err) {
//     console.error(err);
//     console.log("Node NOT Exiting...");
//   });
router.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    console.log(results);
    
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.send(results);
    } 
    else {
      res.render("indexusers", { data: results });
    }
  });
});

router.post("/add", async(req, res) => {
    try{
        const { fullname, username, email, password, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery =
          "INSERT INTO users (fullname, username, email, password, gender) VALUES (?, ?, ?, ?, ?)";
        connection.query(
          insertQuery,
          [fullname, username, email, hashedPassword, gender],
          (err, results) => {
            if(err){
              res.send("fail")
            }
            else{
              res.send("success");}
          }
        );
    }
    catch(err){
        res.send("fail");
        
    }
});

router.get("/delete/:id", (req, res) => {
  const userId = req.params.id;
  const deleteQuery = "DELETE FROM users WHERE id = ?";
  connection.query(deleteQuery, [userId], (err, results) => {
    if (err) throw err;
    res.redirect("/users");
  });
  connection.query("ALTER TABLE users AUTO_INCREMENT = 1;");
});

router.get("/edit/:id", (req, res) => {
  const userId = req.params.id;
  const selectQuery = "SELECT * FROM users WHERE id = ?";
  connection.query(selectQuery, [userId], (err, results) => {
    if (err) throw err;
    res.render("editusers", { user: results[0] });
  });
});

router.post("/update/:id", (req, res) => {
  const userId = req.params.id;
  const { fullname, username, email, password, gender } = req.body;
  const updateQuery =
    "UPDATE users SET fullname = ?, username = ?, email = ?, password = ?, gender = ? WHERE id = ?";
  connection.query(
    updateQuery,
    [fullname, username, email, password, gender, userId],
    (err, results) => {
      if (err) throw err;
      res.redirect("/users");
    }
  );
});

router.get("/login", (req, res) => {
    try {
      // console.log(req.session.user);
      console.log(req.session.user);
  
      if (req.session.user) {
        res.send({ session: req.session.user });
      } else {
        res.send({ session: null });
      }
    } catch (error) {
      res.send(err);
    }
  });
  
  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log("login");
  
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.send("error");
        }
  
        const user = results[0];
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            req.session.save();
            console.log(req.session.cookie);
    
            res.send({ message: "success", user: user });
          } else {
            res.send({ message: "password dont match" });
          }
        }
      );
    });
    
    router.get("/logout", async (req, res) => {
      console.log("Before destroying session:", req.session);
      await req.session.destroy();
    
      console.log("After destroying session:", req.session);
      res.send("Logged out");
    });  

module.exports = router;

const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM blogs", (err, results) => {
    if (err) throw err;
    console.log(results);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.send(results);
    }
    else{
    res.render("indexblogs", { data: results });}
  });
});

router.post("/add", (req, res) => {
  const { username, background, groom_name, bride_name, blog } = req.body;
  const insertQuery = `INSERT INTO blogs (username, background, groom_name, bride_name, blog) VALUES (?, ?, ?, ?, ?)`;
  connection.query(
    insertQuery,
    [username, background, groom_name, bride_name, blog],
    (err, results) => {
      if (err) throw err;
      res.redirect("/blogs");
    }
  );
});

router.get("/delete/:id", (req, res) => {
  const blogId = req.params.id;
  const deleteQuery = "DELETE FROM blogs WHERE id = ?";
  connection.query(deleteQuery, [blogId], (err, results) => {
    if (err) throw err;
    res.redirect("/blogs");
  });
  connection.query("ALTER TABLE blogs AUTO_INCREMENT = 1;");
});

router.get("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const selectQuery = "SELECT * FROM blogs WHERE id = ?";
  connection.query(selectQuery, [blogId], (err, results) => {
    if (err) throw err;
    res.render("editblogs", { blog: results[0] });
  });
});

router.post("/update/:id", (req, res) => {
  const blogId = req.params.id;
  const { username, background, groom_name, bride_name, blog } = req.body;
  const updateQuery =
    "UPDATE blogs SET username = ?, background = ?, groom_name = ?, bride_name = ?, blog = ? WHERE id = ?";
  connection.query(
    updateQuery,
    [username, background, groom_name, bride_name, blog, blogId],
    (err, results) => {
      if (err) throw err;
      res.redirect("/blogs");
    }
  );
});

module.exports = router;

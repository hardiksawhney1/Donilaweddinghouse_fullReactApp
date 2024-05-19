const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM aboutus", (err, results) => {
    if (err) throw err;
    console.log(results);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.send(results);
    }
    else{
    res.render("indexaboutus", { data: results });}
  });
});

router.post("/add", (req, res) => {
  const { image, title, description } = req.body;
  const insertQuery = `INSERT INTO aboutus (image, title, description) VALUES (?, ?, ?)`;
  connection.query(
    insertQuery,
    [image, title, description],
    (err, results) => {
      if (err) throw err;
      res.redirect("/aboutus");
    }
  );
});

router.get("/delete/:id", (req, res) => {
  const aboutusId = req.params.id;
  const deleteQuery = "DELETE FROM aboutus WHERE id = ?";
  connection.query(deleteQuery, [aboutusId], (err, results) => {
    if (err) throw err;
    res.redirect("/aboutus");
  });
  connection.query("ALTER TABLE aboutus AUTO_INCREMENT = 1;");
});

router.get("/edit/:id", (req, res) => {
  const aboutusId = req.params.id;
  const selectQuery = "SELECT * FROM aboutus WHERE id = ?";
  connection.query(selectQuery, [aboutusId], (err, results) => {
    if (err) throw err;
    res.render("editaboutus", { aboutus: results[0] });
  });
});

router.post("/update/:id", (req, res) => {
  const aboutusId = req.params.id;
  const { image, title, description } = req.body;
  const updateQuery =
    "UPDATE aboutus SET image = ?, title = ?, description = ? WHERE id = ?";
  connection.query(
    updateQuery,
    [image, title, description, aboutusId],
    (err, results) => {
      if (err) throw err;
      res.redirect("/aboutus");
    }
  );
});

module.exports = router;

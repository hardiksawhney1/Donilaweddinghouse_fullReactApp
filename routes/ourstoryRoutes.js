const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM ourstory", (err, results) => {
    if (err) throw err;
    console.log(results);
    res.render("indexourstory", { data: results });
  });
});

router.post("/add", (req, res) => {
  const { username, image_url, description } = req.body;
  const insertQuery = `INSERT INTO ourstory (username, image_url, description) VALUES (?, ?, ?)`;
  connection.query(
    insertQuery,
    [username, image_url, description],
    (err, results) => {
      if (err) throw err;
      res.redirect("/ourstory");
    }
  );
});

router.get("/delete/:id", (req, res) => {
  const storyId = req.params.id;
  const deleteQuery = "DELETE FROM ourstory WHERE id = ?";
  connection.query(deleteQuery, [storyId], (err, results) => {
    if (err) throw err;
    res.redirect("/ourstory");
  });
  connection.query("ALTER TABLE ourstory AUTO_INCREMENT = 1;");
});

router.get("/edit/:id", (req, res) => {
  const storyId = req.params.id;
  const selectQuery = "SELECT * FROM ourstory WHERE id = ?";
  connection.query(selectQuery, [storyId], (err, results) => {
    if (err) throw err;
    res.render("editourstory", { story: results[0] });
  });
});

router.post("/update/:id", (req, res) => {
  const storyId = req.params.id;
  const { username, image_url, description } = req.body;
  const updateQuery =
    "UPDATE ourstory SET username = ?, image_url = ?, description = ? WHERE id = ?";
  connection.query(
    updateQuery,
    [username, image_url, description, storyId],
    (err, results) => {
      if (err) throw err;
      res.redirect("/ourstory");
    }
  );
});

module.exports = router;

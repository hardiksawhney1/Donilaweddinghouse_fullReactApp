const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM weddingdetails", (err, results) => {
    if (err) throw err;
    console.log(results);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.send(results);
    } else {
      res.render("indexweddingdetails", { data: results });
    }
  });
});

router.post("/add", (req, res) => {
  const { groom_name, bride_name, weddingdate } = req.body;
  const insertQuery = `INSERT INTO weddingdetails (groom_name, bride_name, weddingdate) VALUES (?, ?, ?)`;
  connection.query(
    insertQuery,
    [groom_name, bride_name, weddingdate],
    (err, results) => {
      if (err) throw err;
      res.redirect("/weddingdetails");
    }
  );
});

router.get("/delete/:id", (req, res) => {
  const weddingId = req.params.id;
  const deleteQuery = "DELETE FROM weddingdetails WHERE id = ?";
  connection.query(deleteQuery, [weddingId], (err, results) => {
    if (err) throw err;
    res.redirect("/weddingdetails");
  });
  connection.query("ALTER TABLE weddingdetails AUTO_INCREMENT = 1;");
});

router.get("/edit/:id", (req, res) => {
  const weddingId = req.params.id;
  const selectQuery = "SELECT * FROM weddingdetails WHERE id = ?";
  connection.query(selectQuery, [weddingId], (err, results) => {
    if (err) throw err;
    res.render("editwedding", { weddingdetail: results[0] });
  });
});

router.post("/update/:id", (req, res) => {
  const weddingId = req.params.id;
  const { groom_name, bride_name, weddingdate } = req.body;
  const updateQuery =
    "UPDATE weddingdetails SET groom_name = ?, bride_name = ?, weddingdate = ? WHERE id = ?";
  connection.query(
    updateQuery,
    [groom_name, bride_name, weddingdate, weddingId],
    (err, results) => {
      if (err) throw err;
      res.redirect("/weddingdetails");
    }
  );
});

module.exports = router;

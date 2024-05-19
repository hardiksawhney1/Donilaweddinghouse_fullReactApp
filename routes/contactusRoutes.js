const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM contactus", (err, results) => {
    if (err) throw err;
    console.log(results);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.send(results);
    } else {
      res.render("indexcontactus", { data: results });
    }
  });
});

router.post("/add", (req, res) => {
  const { name, email, message } = req.body;
  const insertQuery = `INSERT INTO contactus (name, email, message) VALUES (?, ?, ?)`;
  connection.query(
    insertQuery,
    [name, email, message],
    (err, results) => {
      if (err) throw err;
      res.redirect("/contactus");
    }
  );
});

router.get("/delete/:id", (req, res) => {
  const contactusId = req.params.id;
  const deleteQuery = "DELETE FROM contactus WHERE id = ?";
  connection.query(deleteQuery, [contactusId], (err, results) => {
    if (err) throw err;
    res.redirect("/contactus");
  });
  connection.query("ALTER TABLE contactus AUTO_INCREMENT = 1;");
});

router.get("/edit/:id", (req, res) => {
  const contactusId = req.params.id;
  const selectQuery = "SELECT * FROM contactus WHERE id = ?";
  connection.query(selectQuery, [contactusId], (err, results) => {
    if (err) throw err;
    res.render("editcontactus", { contactus: results[0] });
  });
});

router.post("/update/:id", (req, res) => {
  const contactusId = req.params.id;
  const { name, email, message } = req.body;
  const updateQuery =
    "UPDATE contactus SET name = ?, email = ?, message = ? WHERE id = ?";
  connection.query(
    updateQuery,
    [name, email, message, contactusId],
    (err, results) => {
      if (err) throw err;
      res.redirect("/contactus");
    }
  );
});

module.exports = router;

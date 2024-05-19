const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM events", (err, results) => {
    if (err) throw err;
    console.log(results);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.send(results);
    }
    else{
    res.render("indexevents", { data: results });}
  });
});

router.post("/add", (req, res) => {
  const { venue, groom_name, bride_name, photo, noguests, cost, description } = req.body;
  const insertQuery = `INSERT INTO events (venue, groom_name, bride_name, photo, noguests, cost, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    insertQuery,
    [venue, groom_name, bride_name, photo, noguests, cost, description],
    (err, results) => {
      if (err) throw err;
      res.redirect("/events");
    }
  );
});

router.get("/delete/:id", (req, res) => {
  const eventId = req.params.id;
  const deleteQuery = "DELETE FROM events WHERE id = ?";
  connection.query(deleteQuery, [eventId], (err, results) => {
    if (err) throw err;
    res.redirect("/events");
  });
  connection.query("ALTER TABLE events AUTO_INCREMENT = 1;");
});

router.get("/edit/:id", (req, res) => {
  const eventId = req.params.id;
  const selectQuery = "SELECT * FROM events WHERE id = ?";
  connection.query(selectQuery, [eventId], (err, results) => {
    if (err) throw err;
    res.render("editevents", { event: results[0] });
  });
});

router.post("/update/:id", (req, res) => {
  const eventId = req.params.id;
  const { venue, groom_name, bride_name, photo, noguests, cost, description } = req.body;
  const updateQuery =
    "UPDATE events SET venue = ?, groom_name = ?, bride_name = ?, photo = ?, noguests = ?, cost = ?, description = ? WHERE id = ?";
  connection.query(
    updateQuery,
    [venue, groom_name, bride_name, photo, noguests, cost, description, eventId],
    (err, results) => {
      if (err) throw err;
      res.redirect("/events");
    }
  );
});

module.exports = router;
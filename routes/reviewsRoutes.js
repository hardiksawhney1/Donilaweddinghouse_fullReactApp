const express = require("express");
const router = express.Router();
const connection = require("../utils/database");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM reviews", (err, results) => {
    if (err) throw err;
    // console.log(results);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      res.send(results);
    }
    else{
    res.render("indexreviews", { data: results });}
  });
});

router.post("/add", (req, res) => {
  const {photo_url, groom_name, bride_name, review, timestamp, weddingdate } = req.body;
  const username = req.session.user.username;
  var arr = [];
  connection.query(`Select * from weddingdetails where groom_name=? and bride_name =? and weddingdate=?`, 
  [groom_name,  bride_name, weddingdate], (err,results)=>{
    if (err) throw err;
    console.log(results, weddingdate);
    arr = results;
    if(arr.length>0){
      const insertQuery = `INSERT INTO reviews (username, photo_url, groom_name, bride_name, review, timestamp, weddingdate) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      connection.query(
        insertQuery,
        [username, photo_url, groom_name, bride_name, review, timestamp, weddingdate],
        (err, results) => {
          if (err) throw err;
          res.send({message:"success"});
        }
      )}
      else{
        res.send({message:"fail"});
      }
  });
  console.log(arr);
});

router.get("/delete/:id", (req, res) => {
  const reviewId = req.params.id;
  const deleteQuery = "DELETE FROM reviews WHERE id = ?";
  connection.query(deleteQuery, [reviewId], (err, results) => {
    if (err) throw err;
    res.redirect("/reviews");
  });
  connection.query("ALTER TABLE reviews AUTO_INCREMENT = 1;");
});

// router.get("/edit/:id", (req, res) => {
//   const reviewId = req.params.id;
//   const selectQuery = "SELECT * FROM reviews WHERE id = ?";
//   connection.query(selectQuery, [reviewId], (err, results) => {
//     if (err) throw err;
//     res.render("editreviews", { review: results[0] });
//   });
// });

// router.post("/update/:id", (req, res) => {
//   const reviewId = req.params.id;
//   const { username, photo_url, groom_name, bride_name, review } = req.body;
//   const updateQuery =
//     "UPDATE reviews SET username = ?, photo_url = ?, groom_name = ?, bride_name = ?, review = ? WHERE id = ?";
//   connection.query(
//     updateQuery,
//     [username, photo_url, groom_name, bride_name, review, reviewId],
//     (err, results) => {
//       if (err) throw err;
//       res.redirect("/reviews");
//     }
//   );
// });

module.exports = router;

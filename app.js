const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const connection = require("./utils/database");
const reviewsRoutes = require("./routes/reviewsRoutes");
const blogsRoutes = require("./routes/blogsRoutes");
const aboutusRoutes = require("./routes/aboutusRoutes");
const usersRoutes = require("./routes/usersRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const weddingRoutes = require("./routes/weddingRoutes");
const contactusRoutes = require("./routes/contactusRoutes")
const session=require("express-session");
const cookieparser=require("cookie-parser");
const app = express();

connection.connect((err) => {
  if (err) throw err;
  console.log("connected to database");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieparser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: "strict", secure: false },
  })
);

//routes
app.use("/reviews", reviewsRoutes);
app.use("/blogs", blogsRoutes);
app.use("/aboutus", aboutusRoutes);
app.use("/users", usersRoutes);
app.use("/events", eventsRoutes);
app.use("/weddingdetails", weddingRoutes);
app.use("/contactus", contactusRoutes);
app.use("/", (req, res) => {
  console.log("home");

  res.render("home");
});

app.listen(8000, () => {
  console.log("app running on port 8000");
});

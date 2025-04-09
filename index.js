require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");
const Book = require("./models/Book"); // Tambah ini

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Biar bisa handle form
app.use(express.static("public"));

// EJS View Engine
app.set("view engine", "ejs");
app.use(expressLayouts);

// API Routes
app.use("/books", bookRoutes);

// 🖥️ Web View Routes
app.get("/", async (req, res) => {
  const books = await Book.find();
  res.render("index", { books });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  await Book.create(req.body);
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("edit", { book });
});

app.post("/edit/:id", async (req, res) => {
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

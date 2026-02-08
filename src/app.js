require("dotenv").config();
const express = require("express");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const productPageRoutes = require("./routes/productPageRoutes");
const { ensureTableExists } = require("./models/productModel");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/products");
});

app.use("/products", productPageRoutes);

app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

ensureTableExists().catch((error) => {
  console.error("Failed to ensure DynamoDB table:", error);
});

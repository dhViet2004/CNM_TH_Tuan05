const { v4: uuidv4 } = require("uuid");
const productModel = require("../models/productModel");

async function listPage(req, res, next) {
  try {
    const products = await productModel.listProducts();
    return res.render("index", { products });
  } catch (error) {
    return res.render("index", {
      products: [],
      errorMessage: "DynamoDB Local chưa sẵn sàng. Vui lòng thử lại sau.",
    });
  }
}

function addPage(req, res) {
  return res.render("add");
}

async function editPage(req, res, next) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.redirect("/products");
    }
    return res.render("edit", { product });
  } catch (error) {
    return next(error);
  }
}

async function createFromForm(req, res, next) {
  try {
    const { name, price, url_image } = req.body;
    if (!name || price === undefined || !url_image) {
      return res.status(400).send("Missing required fields");
    }

    const product = {
      id: uuidv4(),
      name,
      price: Number(price),
      url_image,
    };

    await productModel.createProduct(product);
    return res.redirect("/products");
  } catch (error) {
    return next(error);
  }
}

async function updateFromForm(req, res, next) {
  try {
    const { name, price, url_image } = req.body;
    if (!name || price === undefined || !url_image) {
      return res.status(400).send("Missing required fields");
    }

    const updated = await productModel.updateProduct(req.params.id, {
      name,
      price: Number(price),
      url_image,
    });

    if (!updated) {
      return res.status(404).send("Product not found");
    }

    return res.redirect("/products");
  } catch (error) {
    return next(error);
  }
}

async function deleteFromForm(req, res, next) {
  try {
    const existing = await productModel.getProductById(req.params.id);
    if (!existing) {
      return res.status(404).send("Product not found");
    }

    await productModel.deleteProduct(req.params.id);
    return res.redirect("/products");
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPage,
  addPage,
  createFromForm,
  editPage,
  updateFromForm,
  deleteFromForm,
};

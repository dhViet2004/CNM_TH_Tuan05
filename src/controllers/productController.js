const { v4: uuidv4 } = require("uuid");
const productModel = require("../models/productModel");

async function createProduct(req, res, next) {
  try {
    const { name, price, url_image } = req.body;
    if (!name || price === undefined || !url_image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = {
      id: uuidv4(),
      name,
      price: Number(price),
      url_image,
    };

    const created = await productModel.createProduct(product);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

async function listProducts(req, res, next) {
  try {
    const items = await productModel.listProducts();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { name, price, url_image } = req.body;
    const updated = await productModel.updateProduct(req.params.id, {
      name,
      price: price !== undefined ? Number(price) : undefined,
      url_image,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const existing = await productModel.getProductById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productModel.deleteProduct(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProduct,
  getProduct,
  listProducts,
  updateProduct,
  deleteProduct,
};

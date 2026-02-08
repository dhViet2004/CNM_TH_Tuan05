const express = require("express");
const controller = require("../controllers/productPageController");

const router = express.Router();

router.get("/", controller.listPage);
router.get("/add", controller.addPage);
router.post("/", controller.createFromForm);
router.get("/:id/edit", controller.editPage);
router.post("/:id", controller.updateFromForm);
router.post("/:id/delete", controller.deleteFromForm);

module.exports = router;

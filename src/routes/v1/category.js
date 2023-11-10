const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/categories");
const { authorize, ADMIN } = require("../../middlewares/auth");
const { createCategory, updateCategory, deleteCategory, getCategoryById } = require("../../validations/category");

const router = express.Router();
/**
 * Load article if articleId route parameter exists
 */
router.param("categoryId", controller.load);

router
	.route("/")
	.get( controller.list)
	.post(authorize(ADMIN), validate(createCategory), controller.create)
router
	.route("/:categoryId")
	.get(validate(getCategoryById), controller.getCategoryById)
	.put(validate(updateCategory), controller.update)  // authorize(ADMIN), 
	.delete(authorize(ADMIN), validate(deleteCategory), controller.remove);
module.exports = router;
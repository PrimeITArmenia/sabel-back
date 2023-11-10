const express = require("express");
const { validate } = require("express-validation");
const upload = require("../../configs/upload");
const controller = require("../../controllers/articles");
const { authorize, USER, ADMIN } = require("../../middlewares/auth");
const { listArticles, createArticle, readArticle, updateArticle, deleteArticle, addFavoriteArticle } = require("../../validations/article");

const router = express.Router();

router.param("articleId", controller.load);

router
	.route("/")
	.get(validate(listArticles), controller.list)
	.post(authorize(ADMIN), upload.single("image"), validate(createArticle), controller.create);
router
	.route("/favorites")
	.get(authorize(USER), controller.getFavoriteArticles) 
router
	.route("/home")
	.get(controller.getShowHomeArticles)
router
	.route("/:articleId")
	.get(validate(readArticle), controller.read)
	.put(authorize(ADMIN),upload.single("image"), validate(updateArticle), controller.update)
	.delete(authorize(ADMIN), validate(deleteArticle), controller.remove)
	.post(authorize(USER), controller.addFavoriteArticle)
module.exports = router;
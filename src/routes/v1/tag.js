const express = require("express");
const { validate } = require("express-validation");
const { createTag, updateTag, deleteTag, getTagById } = require("../../validations/tag");
const controller = require("../../controllers/tag");
const { authorize, ADMIN } = require("../../middlewares/auth");
const router = express.Router();

router
    .route("/")
    .get(controller.getAllTags)
    .post(authorize(ADMIN), validate(createTag), controller.createTag)
router
	.route("/:tagId")
    .get(controller.getTagsById)
	.put(authorize(ADMIN), validate(updateTag), controller.updateTag)
	.delete(authorize(ADMIN), validate(deleteTag), controller.removeTag);
router
    .route('/:tagId/articles')
    .get(controller.getArticlesByTagId);

module.exports = router;
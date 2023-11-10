const express = require("express");
const { validate } = require("express-validation");
const {createComment, updateComment, deleteComment} = require('../../validations/comment');
const controller = require("../../controllers/comment");
const { authorize, USER, ADMIN } = require("../../middlewares/auth");
const router = express.Router();

// router.param("commentId", controller.load);

router
    .route("/")
        .post(authorize(USER), validate(createComment), controller.createComment)
router
	.route("/:commentId")
	.put(authorize(USER), validate(updateComment), controller.updateComment) 
	.delete(authorize([USER, ADMIN]), validate(deleteComment), controller.removeComment);
router	
    .route("/article/:articleId")
	.get( controller.getAllComments)
module.exports = router;
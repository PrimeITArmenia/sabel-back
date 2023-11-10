const express = require("express");
const upload = require("../../configs/upload");
const controller = require("../../controllers/user");
const { authorize, USER, ADMIN } = require("../../middlewares/auth");

const router = express.Router();

router.param("userId", controller.load);

router
	.route("/")
	.get(authorize(ADMIN), controller.getAllUsers)
    .patch(authorize(USER), upload.single("picture"), controller.update)
router
	.route("/profile")
	.get(authorize([USER, ADMIN]), controller.getUserById)
router
	.route("/emailpreference")
	.patch(authorize(USER), controller.updateEmailPreference)
router
	.route("/:userId")
	.delete(authorize([USER, ADMIN]), controller.remove)

module.exports = router;
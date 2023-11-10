const express = require("express");
const controller = require("../../controllers/password");

const router = express.Router();

router
	.route("/forgot")
	.post(controller.forgot)
router
	.route("/reset")
    .post(controller.reset)
router
	.route("/change")
    .post(controller.change)
module.exports = router;